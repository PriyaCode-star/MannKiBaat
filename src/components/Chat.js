import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Send, 
  Paperclip, 
  User, 
  Bot, 
  MessageCircle,
  Heart,
  Zap,
  Smile
} from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState('bhaiya');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history from Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `chats_${user.uid}`),
      orderBy('timestamp', 'asc')
    );

    let unsubscribe;
    try {
      unsubscribe = onSnapshot(q, (snapshot) => {
        const chatMessages = [];
        snapshot.forEach((doc) => {
          chatMessages.push({ id: doc.id, ...doc.data() });
        });
        setMessages(chatMessages);
      });
    } catch (err) {
      console.warn('Realtime listener failed, falling back to one-time fetch');
      (async () => {
        const snap = await getDocs(collection(db, `chats_${user.uid}`));
        const chatMessages = [];
        snap.forEach((d) => chatMessages.push({ id: d.id, ...d.data() }));
        setMessages(chatMessages);
      })();
      return () => {};
    }

    return () => unsubscribe();
  }, [user]);

  // Chill Bhaiya personality responses
  const getBhaiyaResponse = (message, userMood) => {
    const responses = {
      happy: [
        "Bhaiya, aap toh bilkul mast mood mein ho! 😎 Kya baat hai, koi good news?",
        "Arre wah! Aapka mood dekh ke mera bhi mann khush ho gaya! 🎉",
        "Happy mood mein toh sab kuch achha lagta hai na? Bas ye energy maintain rakho!"
      ],
      sad: [
        "Bhaiya, don't worry! Life mein ups and downs toh aate rehte hain. 🌅",
        "Chalo, main aapko ek joke sunata hun... 😄",
        "Sad mood ko bye bye bolo aur happy thoughts ko welcome karo!"
      ],
      angry: [
        "Bhaiya, anger management seekhna padega! 😤 Deep breaths lein...",
        "Angry ho kar kya fayda? Cool down karo aur solution dhoondo!",
        "Rage mode se normal mode mein aao! 😅"
      ],
      lonely: [
        "Bhaiya, aap akela nahi ho! Main hoon na? 🤗",
        "Loneliness is just a feeling, not reality. Call your friends! 📞",
        "Akelepan ko company mein convert kar do! Music suno, movie dekho!"
      ],
      default: [
        "Bhaiya, aapka message padh ke maza aa gaya! 😄",
        "Ye baat toh bilkul sahi hai! 👍",
        "Aapke saath agree karta hun! 💯"
      ]
    };

    const moodResponses = responses[userMood] || responses.default;
    return moodResponses[Math.floor(Math.random() * moodResponses.length)];
  };

  // Chill Didi personality responses
  const getDidiResponse = (message, userMood) => {
    const responses = {
      happy: [
        "Didi, aapka smile dekh ke meri day ban gayi! 🌸✨",
        "Happy Didi = Happy World! Aapke saath rehne mein maza aata hai! 💕",
        "Aapka positive energy contagious hai! Bas ye maintain rakho! 🎊"
      ],
      sad: [
        "Didi, don't cry! Aapki aankhon mein aansu dekh ke mera dil dard karta hai! 😢💔",
        "Chalo, main aapko comfort karoon... Everything will be okay! 🤗",
        "Sad Didi ko happy Didi banaane mein main help karungi! 🌈"
      ],
      angry: [
        "Didi, anger se wrinkles aate hain! 😤 Calm down, sweetie!",
        "Angry Didi ko dekh ke sab dar jaate hain! 😅 Cool down!",
        "Rage mode se beauty mode mein switch karo! 💅✨"
      ],
      lonely: [
        "Didi, aap kabhi akeli nahi ho sakti! Main hoon na? 🤗💖",
        "Loneliness ko friendship mein convert kar do! Call your besties! 📱",
        "Akelepan ko me-time mein convert kar do! Self-care karo! 💆‍♀️"
      ],
      default: [
        "Didi, aapki baat bilkul sahi hai! 💯",
        "Aapke saath agree karti hun! 👍✨",
        "Ye baat toh bilkul perfect hai! 🎯"
      ]
    };

    const moodResponses = responses[userMood] || responses.default;
    return moodResponses[Math.floor(Math.random() * moodResponses.length)];
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !user) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      personality: selectedPersonality
    };

    // Add user message to chat
    try {
      await addDoc(collection(db, `chats_${user.uid}`), userMessage);
    } catch (error) {
      console.error('Error adding message:', error);
    }

    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking and generate response
    setTimeout(() => {
      const aiResponse = selectedPersonality === 'bhaiya' 
        ? getBhaiyaResponse(inputMessage, user.mood)
        : getDidiResponse(inputMessage, user.mood);

      const aiMessage = {
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        personality: selectedPersonality
      };

      addDoc(collection(db, `chats_${user.uid}`), aiMessage);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="pb-20 h-screen flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Chill Bhaiya/Didi AI Chat</h2>
              <p className="text-sm text-gray-500">Your personal AI companion</p>
            </div>
          </div>
          
          {/* Personality Selector */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedPersonality('bhaiya')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedPersonality === 'bhaiya'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Zap className="w-4 h-4 inline mr-1" />
              Bhaiya
            </button>
            <button
              onClick={() => setSelectedPersonality('didi')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedPersonality === 'didi'
                  ? 'bg-accent-100 text-accent-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className="w-4 h-4 inline mr-1" />
              Didi
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smile className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start a conversation with {selectedPersonality === 'bhaiya' ? 'Chill Bhaiya' : 'Chill Didi'}!
            </h3>
            <p className="text-gray-500">
              {selectedPersonality === 'bhaiya' 
                ? 'Get ready for some funny roasts and supportive advice!'
                : 'Get ready for caring conversations and emotional support!'
              }
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                  <span className="text-xs opacity-75">
                    {message.sender === 'user' ? 'You' : (message.personality === 'bhaiya' ? 'Chill Bhaiya' : 'Chill Didi')}
                  </span>
                </div>
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-75 mt-1 text-right">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <span className="text-xs opacity-75">
                  {selectedPersonality === 'bhaiya' ? 'Chill Bhaiya' : 'Chill Didi'} is typing...
                </span>
              </div>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Paperclip className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="input-field"
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-xl transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat; 