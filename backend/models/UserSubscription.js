import mongoose from 'mongoose';

const userSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  
  // Plan details
  planType: {
    type: String,
    enum: ['free', 'student_premium', 'student_parent_premium_pro', 'educational_institutions_premium'],
    required: true,
    default: 'free',
  },
  
  planName: {
    type: String,
    required: true,
  },
  
  // Pricing
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  
  firstYearAmount: {
    type: Number,
    default: 0,
  },
  
  renewalAmount: {
    type: Number,
    default: 0,
  },
  
  isFirstYear: {
    type: Boolean,
    default: true,
  },
  
  // Subscription status
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'pending',
  },
  
  // Dates
  startDate: {
    type: Date,
    default: Date.now,
  },
  
  endDate: {
    type: Date,
  },
  
  cancelledAt: {
    type: Date,
  },
  
  // Payment details
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet'],
  },
  
  // Razorpay fields (keeping stripe fields for backward compatibility during migration)
  razorpayCustomerId: {
    type: String,
  },
  
  stripeCustomerId: {
    type: String,
  },
  
  stripeSubscriptionId: {
    type: String,
  },
  
  stripePaymentMethodId: {
    type: String,
  },
  
  // Transaction history
  transactions: [{
    transactionId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending',
    },
    mode: {
      type: String,
      enum: ['purchase', 'renewal', 'upgrade', 'system'],
      default: 'purchase',
    },
    initiatedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      role: String,
      name: String,
      email: String,
      context: {
        type: String,
        enum: ['student', 'parent', 'admin', 'school_admin', 'system'],
        default: 'student',
      },      
    },
    paymentDate: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    stripePaymentIntentId: String, // Keep for backward compatibility
    receiptUrl: String,
    notes: String,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  }],

  purchasedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: String,
    name: String,
    email: String,
    context: {
      type: String,
      enum: ['student', 'parent', 'admin', 'school_admin', 'system'],
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },

  lastRenewedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: String,
    name: String,
    email: String,
    context: {
      type: String,
      enum: ['student', 'parent', 'admin', 'school_admin', 'system'],
    },
    renewedAt: Date,
  },

  renewalCount: {
    type: Number,
    default: 0,
  },

  lastPaymentAt: {
    type: Date,
  },
  
  // Auto-renewal
  autoRenew: {
    type: Boolean,
    default: true,
  },
  
  autoRenewSettings: {
    enabled: {
      type: Boolean,
      default: true,
    },
    method: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'manual'],
      default: 'card',
    },
    paymentMethodId: String,
    paymentMethodLabel: String,
    lastFour: String,
    brand: String,
    mandateStatus: {
      type: String,
      enum: ['pending', 'active', 'failed', 'cancelled', 'not_required'],
      default: 'not_required',
    },
    nextDebitDate: Date,
    updatedAt: Date,
    updatedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      role: String,
      name: String,
      email: String,
    },
  },
  
  // Features
  features: {
    fullAccess: {
      type: Boolean,
      default: false,
    },
    parentDashboard: {
      type: Boolean,
      default: false,
    },
    advancedAnalytics: {
      type: Boolean,
      default: false,
    },
    certificates: {
      type: Boolean,
      default: false,
    },
    wiseClubAccess: {
      type: Boolean,
      default: false,
    },
    inavoraAccess: {
      type: Boolean,
      default: false,
    },
    gamesPerPillar: {
      type: Number,
      default: 5, // Free plan has 5 games
    },
    totalGames: {
      type: Number,
      default: 50, // 5 games × 10 pillars
    },
  },
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  
}, {
  timestamps: true,
});

// Indexes
userSubscriptionSchema.index({ userId: 1, status: 1 });
userSubscriptionSchema.index({ stripeCustomerId: 1 });
userSubscriptionSchema.index({ stripeSubscriptionId: 1 });

// Methods
userSubscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && 
         (!this.endDate || new Date(this.endDate) > new Date());
};

userSubscriptionSchema.methods.isExpired = function() {
  return this.endDate && new Date(this.endDate) <= new Date();
};

userSubscriptionSchema.methods.daysRemaining = function() {
  if (!this.endDate) return null;
  const now = new Date();
  const end = new Date(this.endDate);
  const diff = end - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

userSubscriptionSchema.methods.canUpgrade = function() {
  return this.planType === 'free' ||
         (this.planType === 'student_premium' && this.status === 'active');
};

// Static methods
userSubscriptionSchema.statics.getActiveSubscription = async function(userId) {
  return this.findOne({
    userId,
    status: 'active',
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gt: new Date() } }
    ]
  }).sort({ createdAt: -1 });
};

userSubscriptionSchema.statics.getLatestSubscription = async function(userId) {
  return this.findOne({
    userId
  }).sort({ createdAt: -1 });
};

const UserSubscription = mongoose.model('UserSubscription', userSubscriptionSchema);

export default UserSubscription;

