import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Droplet, Heart, Lightbulb, Home, Download, Share2 } from "lucide-react";

const FamilyCalmCorner = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-17";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [placedItems, setPlacedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [designComplete, setDesignComplete] = useState(false);

  // Design items available for the calm corner
  const designItems = [
    {
      id: 'plant-1',
      name: 'Peaceful Plant',
      emoji: '🌿',
      category: 'plants',
      description: 'Green plants create a calming atmosphere',
      icon: Droplet,
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'plant-2',
      name: 'Lavender Plant',
      emoji: '🌱',
      category: 'plants',
      description: 'Aromatherapy plant for relaxation',
      icon: Droplet,
      color: 'from-purple-400 to-indigo-500'
    },
    {
      id: 'cushion-1',
      name: 'Soft Cushion',
      emoji: '🛋️',
      category: 'cushions',
      description: 'Comfortable seating for calm moments',
      icon: Heart,
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'cushion-2',
      name: 'Floor Pillow',
      emoji: '🪑',
      category: 'cushions',
      description: 'Cozy floor seating option',
      icon: Heart,
      color: 'from-pink-400 to-rose-500'
    },
    {
      id: 'light-1',
      name: 'String Lights',
      emoji: '💡',
      category: 'lights',
      description: 'Soft, warm lighting for ambiance',
      icon: Lightbulb,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'light-2',
      name: 'Salt Lamp',
      emoji: '🪔',
      category: 'lights',
      description: 'Gentle, calming light source',
      icon: Lightbulb,
      color: 'from-amber-400 to-yellow-500'
    },
    {
      id: 'sign-1',
      name: 'Calm Corner Sign',
      emoji: '📋',
      category: 'signs',
      description: 'Welcome sign for your calm space',
      icon: Home,
      color: 'from-indigo-400 to-purple-500'
    },
    {
      id: 'sign-2',
      name: 'Breathing Guide',
      emoji: '📜',
      category: 'signs',
      description: 'Visual guide for breathing exercises',
      icon: Home,
      color: 'from-teal-400 to-cyan-500'
    },
    {
      id: 'blanket-1',
      name: 'Cozy Blanket',
      emoji: '🧸',
      category: 'comfort',
      description: 'Soft blanket for comfort',
      icon: Heart,
      color: 'from-rose-400 to-pink-500'
    },
    {
      id: 'book-1',
      name: 'Calm Book',
      emoji: '📚',
      category: 'comfort',
      description: 'Reading materials for quiet time',
      icon: Heart,
      color: 'from-blue-400 to-indigo-500'
    }
  ];

  // Design steps/challenges
  const designSteps = [
    {
      id: 1,
      title: "Choose Your Space",
      instruction: "Select at least 2 items to place in your calm corner. Start with plants for a calming atmosphere.",
      requiredItems: 2,
      category: 'plants',
      tip: "Plants help create a sense of peace and connection with nature."
    },
    {
      id: 2,
      title: "Add Comfort",
      instruction: "Add cushions or soft seating for comfort. Choose items that invite rest and relaxation.",
      requiredItems: 1,
      category: 'cushions',
      tip: "Comfortable seating makes the space inviting and usable."
    },
    {
      id: 3,
      title: "Set the Mood",
      instruction: "Add lighting to create a calm ambiance. Soft, warm light helps signal rest and calm.",
      requiredItems: 1,
      category: 'lights',
      tip: "Lighting sets the mood. Soft lights help the body relax."
    },
    {
      id: 4,
      title: "Add Personal Touch",
      instruction: "Add signs, blankets, or books to make it personal. This makes the space feel special and welcoming.",
      requiredItems: 1,
      category: 'comfort',
      tip: "Personal items make the space feel safe and inviting."
    },
    {
      id: 5,
      title: "Complete Your Design",
      instruction: "Review your calm corner and make any final touches. When ready, save and share with your family!",
      requiredItems: 0,
      category: 'any',
      tip: "Your calm corner is ready! Remember to model using it yourself."
    }
  ];

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  const handlePlaceItem = (e, item) => {
    if (!selectedItem) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if item already placed (one instance per item type)
    const existingIndex = placedItems.findIndex(pi => pi.id === selectedItem.id);
    
    if (existingIndex >= 0) {
      // Update position
      setPlacedItems(prev => prev.map((pi, idx) => 
        idx === existingIndex 
          ? { ...pi, x: Math.max(0, Math.min(x - 40, rect.width - 80)), y: Math.max(0, Math.min(y - 40, rect.height - 80)) }
          : pi
      ));
    } else {
      // Add new item
      setPlacedItems(prev => [...prev, {
        ...selectedItem,
        x: Math.max(0, Math.min(x - 40, rect.width - 80)),
        y: Math.max(0, Math.min(y - 40, rect.height - 80))
      }]);
    }

    setSelectedItem(null);
  };

  const handleRemoveItem = (itemId) => {
    setPlacedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleNext = () => {
    const currentStepData = designSteps[currentStep];
    const placedInCategory = placedItems.filter(item => {
      if (currentStepData.category === 'any') return true;
      return item.category === currentStepData.category;
    });

    if (placedInCategory.length >= currentStepData.requiredItems) {
      setScore(prev => prev + 1);
      if (currentStep < designSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setDesignComplete(true);
        setTimeout(() => {
          setShowGameOver(true);
        }, 2000);
      }
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setPlacedItems([]);
    setSelectedItem(null);
    setScore(0);
    setShowGameOver(false);
    setDesignComplete(false);
  };

  const progress = ((currentStep + 1) / designSteps.length) * 100;
  const currentStepData = designSteps[currentStep];
  const placedInCategory = placedItems.filter(item => {
    if (currentStepData.category === 'any') return true;
    return item.category === currentStepData.category;
  });
  const canProceed = placedInCategory.length >= currentStepData.requiredItems;

  // Filter items by current step category
  const availableItems = currentStepData.category === 'any' 
    ? designItems 
    : designItems.filter(item => item.category === currentStepData.category || placedItems.some(pi => pi.id === item.id));

  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {designSteps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 mb-6 shadow-xl border-2 border-purple-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-lg text-gray-700 mb-3">
            {currentStepData.instruction}
          </p>
          <div className="bg-white/60 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              💡 <strong>Tip:</strong> {currentStepData.tip}
            </p>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Progress: {placedInCategory.length} / {currentStepData.requiredItems} {currentStepData.requiredItems > 0 ? 'required' : 'items placed'}
          </div>
        </div>

        {designComplete ? (
          /* Design complete view */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold text-gray-900">
              Your Calm Corner is Ready!
            </h3>
            <p className="text-lg text-gray-700">
              You've created a beautiful calm space for your family. Share this design with your family and start using it together!
            </p>
            
            {/* Design preview */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl border-2 border-purple-200 relative" style={{ minHeight: '400px' }}>
              {placedItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute cursor-pointer"
                  style={{ left: `${item.x}px`, top: `${item.y}px` }}
                  whileHover={{ scale: 1.2 }}
                >
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg text-4xl`}>
                    {item.emoji}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Share buttons */}
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                onClick={() => {
                  // Simulate saving/exporting
                  alert('Your calm corner design has been saved! You can share this with your family.');
                }}
              >
                <Download className="w-5 h-5" />
                Save Design
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                onClick={() => {
                  // Simulate sharing
                  alert('Share your calm corner design with your family to start using it together!');
                }}
              >
                <Share2 className="w-5 h-5" />
                Share with Family
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Item palette */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Design Items
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availableItems.map((item) => {
                    const isPlaced = placedItems.some(pi => pi.id === item.id);
                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleItemSelect(item)}
                        disabled={isPlaced && currentStepData.category !== 'any'}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          selectedItem?.id === item.id
                            ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-400 shadow-lg'
                            : isPlaced
                            ? 'bg-gray-100 border-gray-300 opacity-60'
                            : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`text-3xl ${isPlaced ? 'opacity-50' : ''}`}>
                            {item.emoji}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-600">{item.description}</div>
                          </div>
                          {isPlaced && <span className="text-xs text-green-600">✓ Placed</span>}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                
                {selectedItem && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      Click on the design area to place: <strong>{selectedItem.name}</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Design canvas */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Design Your Calm Corner
                </h3>
                
                <div
                  onClick={handlePlaceItem}
                  className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-purple-300 cursor-crosshair"
                  style={{ minHeight: '500px', position: 'relative' }}
                >
                  {/* Placed items */}
                  {placedItems.map((item) => (
                    <motion.div
                      key={item.id}
                      drag
                      dragMomentum={false}
                      onDragEnd={(e, info) => {
                        const rect = e.target.closest('[onClick]')?.getBoundingClientRect();
                        if (rect) {
                          setPlacedItems(prev => prev.map(pi => 
                            pi.id === item.id 
                              ? { 
                                  ...pi, 
                                  x: Math.max(0, Math.min(info.point.x - rect.left - 40, rect.width - 80)),
                                  y: Math.max(0, Math.min(info.point.y - rect.top - 40, rect.height - 80))
                                }
                              : pi
                          ));
                        }
                      }}
                      whileHover={{ scale: 1.1 }}
                      className="absolute cursor-move group"
                      style={{ left: `${item.x}px`, top: `${item.y}px` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (e.detail === 2) {
                          handleRemoveItem(item.id);
                        }
                      }}
                    >
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg text-4xl relative group-hover:ring-4 group-hover:ring-white`}>
                        {item.emoji}
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.name} (double-click to remove)
                      </div>
                    </motion.div>
                  ))}

                  {/* Empty state hint */}
                  {placedItems.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-400 text-lg">
                        {selectedItem 
                          ? `Click here to place ${selectedItem.name}`
                          : 'Select an item and click here to place it'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next button */}
        {!designComplete && (
          <div className="mt-6 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all ${
                canProceed
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentStep < designSteps.length - 1 ? 'Next Step' : 'Complete Design'}
            </motion.button>
          </div>
        )}

        {/* Parent tip */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-sm text-amber-800 leading-relaxed text-center">
            <strong>💡 Parent Tip:</strong> Model self-regulation—go to the calm corner yourself when upset. 
            When your child sees you using the calm corner, they learn that everyone needs moments to reset. 
            This teaches them that managing emotions is normal and healthy, not something to hide.
          </p>
        </div>
      </motion.div>
    </div>
  );

  return (
    <ParentGameShell
      gameId={gameId}
      gameData={gameData}
      totalCoins={totalCoins}
      totalLevels={totalLevels}
      currentLevel={currentStep + 1}
      score={score}
      showGameOver={showGameOver}
      onRestart={handleRestart}
      progress={progress}
    >
      {gameContent}
    </ParentGameShell>
  );
};

export default FamilyCalmCorner;

