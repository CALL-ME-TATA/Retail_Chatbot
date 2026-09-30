// Realistic mock data for EmpathIQ Retail Customer Sentiment Analysis

export const INITIAL_STATS = {
  activeConversations: 12,
  negativeConversations: 4,
  escalationsToday: 3,
};

export const MOCK_CONVERSATIONS = [
  {
    id: "conv-1",
    customer: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    initials: "SJ",
    lastMessage: "Where is my order?",
    timestamp: "2 min ago",
    customerSince: "2024",
    orderId: "ORD-28491",
    product: "Wireless Noise-Canceling Headphones",
    productCategory: "Audio & Electronics",
    orderStatus: "Delayed in Transit",
    expectedDelivery: "September 28",
    trackingCarrier: "FedEx Express (Tracking #9248-1102-4412)",
    orderAmount: "$189.99",
    sentiment: "negative",
    confidence: 0.94,
    emotion: "Frustrated",
    intent: "Delivery Complaint",
    aspect: "Delivery",
    aspectBreakdown: [
      { aspect: "Delivery", sentiment: "negative", note: "Late by 4 days" },
      { aspect: "Product", sentiment: "neutral", note: "Pending receipt" }
    ],
    priority: "high",
    escalate: true,
    escalationDetails: {
      priority: "High",
      reason: "Customer has expressed repeated frustration and the issue remains unresolved after multiple touchpoints.",
      trigger: "Repeated negative sentiment (Turn 1 Neutral → Turn 4 Negative)",
      recommendedAction: "Human agent review & dispatch expedited replacement or courier contact",
      handoffSummary: {
        customer: "Sarah Johnson",
        issue: "Delayed delivery of Wireless Headphones",
        sentiment: "Negative (94% confidence)",
        trend: "Increasingly negative across 4 turns",
        reason: "Repeated complaint without resolution",
        recommendedAction: "Priority human agent review & courier tracing",
        carrierStatus: "Delayed in Transit (Memphis Hub)",
        estimatedValue: "$189.99"
      }
    },
    strategy: {
      type: "ACKNOWLEDGE → ACT",
      action: "Reflect and apologize",
      guidance: "Acknowledge repeated contact with genuine empathy; avoid generic platitudes; flag for human tier-2 supervisor."
    },
    trajectory: [
      { turn: "Turn 1", label: "T1", score: 0.05, sentiment: "Neutral", text: "Inquiring about tracking number" },
      { turn: "Turn 2", label: "T2", score: -0.45, sentiment: "Negative", text: "Reporting delivery delay" },
      { turn: "Turn 3", label: "T3", score: -0.80, sentiment: "More Negative", text: "Expressing frustration at previous non-response" },
      { turn: "Turn 4", label: "T4", score: -0.92, sentiment: "Negative", text: "Demanding immediate human intervention" }
    ],
    messages: [
      {
        id: "m-1",
        sender: "customer",
        senderName: "Sarah Johnson",
        time: "10:14 AM",
        content: "Hi, I ordered my headphones last week and they still haven't arrived. I've already contacted support once. This is really frustrating."
      },
      {
        id: "m-2",
        sender: "ai",
        senderName: "EmpathIQ AI",
        time: "10:14 AM",
        content: "I'm sorry you've had to wait longer than expected, especially after already contacting support. I understand how frustrating that can be.\n\nI can help you check the current order status and identify the next available step."
      },
      {
        id: "m-3",
        sender: "customer",
        senderName: "Sarah Johnson",
        time: "10:16 AM",
        content: "That's what I was told last time. I just want someone to actually help me."
      },
      {
        id: "m-4",
        sender: "ai",
        senderName: "EmpathIQ AI",
        time: "10:16 AM",
        content: "I understand. Since you've already contacted support and the issue remains unresolved, I'm flagging this conversation for human review."
      }
    ]
  },
  {
    id: "conv-2",
    customer: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    initials: "MC",
    lastMessage: "Love the product! Delivery was really fast.",
    timestamp: "8 min ago",
    customerSince: "2023",
    orderId: "ORD-31902",
    product: "Ergonomic Mechanical Keyboard",
    productCategory: "Computer Accessories",
    orderStatus: "Delivered",
    expectedDelivery: "September 26 (Delivered on time)",
    trackingCarrier: "UPS Next Day Air",
    orderAmount: "$129.50",
    sentiment: "positive",
    confidence: 0.98,
    emotion: "Delighted",
    intent: "Product Praise & Feedback",
    aspect: "Product",
    aspectBreakdown: [
      { aspect: "Product", sentiment: "positive", note: "Build quality praised" },
      { aspect: "Delivery", sentiment: "positive", note: "Arrived early" }
    ],
    priority: "low",
    escalate: false,
    escalationDetails: null,
    strategy: {
      type: "AFFIRM",
      action: "Affirm and delight",
      guidance: "Thank customer warmly; provide warranty registration link or complimentary care tips."
    },
    trajectory: [
      { turn: "Turn 1", label: "T1", score: 0.65, sentiment: "Positive", text: "Product received on schedule" },
      { turn: "Turn 2", label: "T2", score: 0.88, sentiment: "Positive", text: "Praising build quality and tactile switches" },
      { turn: "Turn 3", label: "T3", score: 0.96, sentiment: "Very Positive", text: "Recommending to colleagues" }
    ],
    messages: [
      {
        id: "mc-1",
        sender: "customer",
        senderName: "Michael Chen",
        time: "10:02 AM",
        content: "Hey there! Just wanted to say I love the mechanical keyboard! Delivery was really fast and typing feels incredible."
      },
      {
        id: "mc-2",
        sender: "ai",
        senderName: "EmpathIQ AI",
        time: "10:02 AM",
        content: "That's wonderful to hear, Michael! We're thrilled that the keyboard is providing such a great typing experience. Your order #ORD-31902 has a 2-year manufacturer warranty automatically registered. Is there anything else I can assist with today?"
      },
      {
        id: "mc-3",
        sender: "customer",
        senderName: "Michael Chen",
        time: "10:05 AM",
        content: "No that's all, thank you so much for the swift service!"
      }
    ]
  },
  {
    id: "conv-3",
    customer: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    initials: "PS",
    lastMessage: "What is your return policy? I need help with my refund.",
    timestamp: "14 min ago",
    customerSince: "2024",
    orderId: "ORD-27150",
    product: "Smart Fitness Tracker Band",
    productCategory: "Wearables",
    orderStatus: "Delivered (3 days ago)",
    expectedDelivery: "September 24",
    trackingCarrier: "USPS Ground Advantage",
    orderAmount: "$79.00",
    sentiment: "neutral",
    confidence: 0.91,
    emotion: "Inquiring",
    intent: "Return Policy & Procedure",
    aspect: "Service",
    aspectBreakdown: [
      { aspect: "Service", sentiment: "neutral", note: "Inquiring about 30-day policy" },
      { aspect: "Price", sentiment: "neutral", note: "Standard refund process" }
    ],
    priority: "low",
    escalate: false,
    escalationDetails: null,
    strategy: {
      type: "INFORM",
      action: "Inform with clarity",
      guidance: "Provide step-by-step return authorization instructions without friction."
    },
    trajectory: [
      { turn: "Turn 1", label: "T1", score: 0.1, sentiment: "Neutral", text: "Asking for policy documentation" },
      { turn: "Turn 2", label: "T2", score: 0.15, sentiment: "Neutral", text: "Checking prepaid shipping label conditions" }
    ],
    messages: [
      {
        id: "ps-1",
        sender: "customer",
        senderName: "Priya Sharma",
        time: "9:56 AM",
        content: "What is your return policy? I need help with my refund process if the sizing doesn't fit."
      },
      {
        id: "ps-2",
        sender: "ai",
        senderName: "EmpathIQ AI",
        time: "9:56 AM",
        content: "Hello Priya! We offer hassle-free 30-day returns on all wearable products from the date of delivery. Items should be in original condition with packaging.\n\nIf you decide to initiate a return for #ORD-27150, I can generate a prepaid return shipping label directly for your order. Would you like me to walk you through that now?"
      }
    ]
  },
  {
    id: "conv-4",
    customer: "David Miller",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    initials: "DM",
    lastMessage: "I love the headphones, but the delivery experience was terrible.",
    timestamp: "22 min ago",
    customerSince: "2023",
    orderId: "ORD-29831",
    product: "Studio Wireless Over-Ear Headphones",
    productCategory: "Audio",
    orderStatus: "Delivered (Box Damaged)",
    expectedDelivery: "September 25",
    trackingCarrier: "Regional Courier",
    orderAmount: "$229.00",
    sentiment: "mixed",
    confidence: 0.89,
    emotion: "Conflicted",
    intent: "Mixed Feedback / Delivery Courier Issue",
    aspect: "Delivery",
    aspectBreakdown: [
      { aspect: "Product", sentiment: "positive", note: "Loves headphone sound quality" },
      { aspect: "Delivery", sentiment: "negative", note: "Courier left box in rain, battered package" }
    ],
    priority: "medium",
    escalate: false,
    escalationDetails: null,
    strategy: {
      type: "ACKNOWLEDGE → ACT",
      action: "Segment & Address",
      guidance: "Acknowledge satisfaction with product while validating courier grievance; file carrier complaint."
    },
    trajectory: [
      { turn: "Turn 1", label: "T1", score: 0.4, sentiment: "Positive", text: "Product sound quality is great" },
      { turn: "Turn 2", label: "T2", score: -0.3, sentiment: "Mixed", text: "Delivery box was soggy and left outside" }
    ],
    messages: [
      {
        id: "dm-1",
        sender: "customer",
        senderName: "David Miller",
        time: "9:42 AM",
        content: "I love the headphones, but the delivery experience was terrible. The driver left the box on the driveway in the rain."
      },
      {
        id: "dm-2",
        sender: "ai",
        senderName: "EmpathIQ AI",
        time: "9:42 AM",
        content: "I'm glad to hear you enjoy the headphones, but I am truly sorry about how the courier handled your delivery. Leaving packages exposed to rain is unacceptable.\n\nAre the headphones functioning properly, or did moisture penetrate the outer packaging? I can log a formal carrier complaint and provide a courtesy credit if there was packaging damage."
      }
    ]
  },
  {
    id: "conv-5",
    customer: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    initials: "ER",
    lastMessage: "I want a refund right now. Do not delay this.",
    timestamp: "38 min ago",
    customerSince: "2024",
    orderId: "ORD-24119",
    product: "Smart Air Purifier Filter Pack",
    productCategory: "Home Essentials",
    orderStatus: "Return In Transit",
    expectedDelivery: "September 20",
    trackingCarrier: "FedEx Ground",
    orderAmount: "$94.50",
    sentiment: "negative",
    confidence: 0.96,
    emotion: "Demanding",
    intent: "Immediate Refund Demand",
    aspect: "Price",
    aspectBreakdown: [
      { aspect: "Price", sentiment: "negative", note: "Demanding instant ledger reversal" },
      { aspect: "Service", sentiment: "negative", note: "Frustrated by banking processing window" }
    ],
    priority: "high",
    escalate: true,
    escalationDetails: {
      priority: "High",
      reason: "Immediate refund demanded outside automated policy limits; requires supervisor approval.",
      trigger: "High financial friction & explicit refund demand",
      recommendedAction: "Escalate to Billing Tier-2 Specialist for manual override review",
      handoffSummary: {
        customer: "Elena Rostova",
        issue: "Demanding immediate refund override for return package in transit",
        sentiment: "Negative (96% confidence)",
        trend: "Urgent refund demand",
        reason: "Customer demands instant payment reversal prior to warehouse inspection",
        recommendedAction: "Supervisor review to consider courtesy instant refund authorization",
        carrierStatus: "Return package scanned at distribution depot",
        estimatedValue: "$94.50"
      }
    },
    strategy: {
      type: "ACKNOWLEDGE → ACT",
      action: "De-escalate & Route",
      guidance: "Do NOT imply refund is completed; clearly explain policy transparently and offer immediate agent handoff."
    },
    trajectory: [
      { turn: "Turn 1", label: "T1", score: -0.5, sentiment: "Negative", text: "Asking why refund has not posted" },
      { turn: "Turn 2", label: "T2", score: -0.85, sentiment: "Negative", text: "Demanding immediate ledger reversal" }
    ],
    messages: [
      {
        id: "er-1",
        sender: "customer",
        senderName: "Elena Rostova",
        time: "9:20 AM",
        content: "I dropped off the return box 3 days ago. I want a refund right now. Do not delay this."
      },
      {
        id: "er-2",
        sender: "ai",
        senderName: "EmpathIQ AI",
        time: "9:20 AM",
        content: "I understand you want your refund processed without delay after returning the item. While automated refunds are triggered once the warehouse inspects the scan (usually 2-3 business days), I recognize your urgency.\n\nI am forwarding your account to our Billing Specialist team right now so a representative can verify the drop-off receipt and evaluate an immediate manual authorization."
      }
    ]
  },
  {
    id: "conv-6",
    customer: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80",
    initials: "MV",
    lastMessage: "I think this transaction is fraudulent. I never authorized this.",
    timestamp: "1 hour ago",
    customerSince: "2024",
    orderId: "ORD-99014",
    product: "UltraHD 4K Gaming Monitor",
    productCategory: "Electronics",
    orderStatus: "Order Placed / Verification Pending",
    expectedDelivery: "October 02",
    trackingCarrier: "Pending Verification",
    orderAmount: "$649.00",
    sentiment: "negative",
    confidence: 0.99,
    emotion: "Alarmed",
    intent: "Fraud & Security Alert",
    aspect: "Service",
    aspectBreakdown: [
      { aspect: "Service", sentiment: "negative", note: "Account security compromised" },
      { aspect: "Price", sentiment: "negative", note: "Unauthorized card transaction" }
    ],
    priority: "high",
    escalate: true,
    escalationDetails: {
      priority: "Critical / Immediate",
      reason: "Potential fraudulent purchase reported. Account security protocol triggered.",
      trigger: "Fraudulent transaction claim",
      recommendedAction: "Immediate dispatch hold & route to Fraud Prevention Unit",
      handoffSummary: {
        customer: "Marcus Vance",
        issue: "Reported unauthorized charge & potential compromised account",
        sentiment: "Negative / Alarmed (99% confidence)",
        trend: "Immediate security escalation",
        reason: "Fraud allegation on $649.00 monitor order",
        recommendedAction: "Freeze order shipment immediately, secure customer credentials, call customer",
        carrierStatus: "Fulfillment held in warehouse queue",
        estimatedValue: "$649.00"
      }
    },
    strategy: {
      type: "EMERGENCY ESCALATION",
      action: "Secure & Freeze",
      guidance: "Do not attempt conversational resolution; immediately freeze shipment and hand off to Trust & Safety."
    },
    trajectory: [
      { turn: "Turn 1", label: "T1", score: -0.95, sentiment: "Severe Negative", text: "Fraudulent charge detected on banking statement" }
    ],
    messages: [
      {
        id: "mv-1",
        sender: "customer",
        senderName: "Marcus Vance",
        time: "8:55 AM",
        content: "I think this transaction is fraudulent. I received an order confirmation for $649 that I never authorized."
      },
      {
        id: "mv-2",
        sender: "ai",
        senderName: "EmpathIQ AI",
        time: "8:55 AM",
        content: "Thank you for alerting us immediately, Marcus. I have placed an immediate hold on order #ORD-99014 to prevent dispatch, and flagged your account for our Trust & Safety Fraud Prevention team.\n\nA fraud investigator is stepping in immediately to verify your account and void any unauthorized charges."
      }
    ]
  }
];

// Predefined Hackathon Demo Scenarios directly matching the prompt requirements
export const DEMO_SCENARIOS = [
  {
    id: "sc-1",
    title: "Scenario 1: Happy Customer",
    badge: "Positive",
    badgeColor: "success",
    description: "Customer expresses delight with fast delivery and great product.",
    inputPrompt: "I love the product! Delivery was really fast.",
    mockResponse: {
      sentiment: "positive",
      confidence: 0.98,
      emotion: "Delighted",
      intent: "Product Praise & Feedback",
      aspect: "Product",
      priority: "low",
      escalate: false,
      strategy: "Affirm",
      strategyDetail: "Affirm and delight with appreciation",
      aiReply: "Thank you so much! We're thrilled that you love the product and that delivery arrived ahead of schedule. Your feedback brightens our day—please enjoy it!",
      trajectoryPoint: { turn: "Turn 2", label: "T2", score: 0.95, sentiment: "Positive" }
    }
  },
  {
    id: "sc-2",
    title: "Scenario 2: Neutral Customer",
    badge: "Neutral",
    badgeColor: "info",
    description: "Informational inquiry regarding standard return policy.",
    inputPrompt: "What is your return policy?",
    mockResponse: {
      sentiment: "neutral",
      confidence: 0.92,
      emotion: "Inquiring",
      intent: "Information Request",
      aspect: "Service",
      priority: "low",
      escalate: false,
      strategy: "Inform",
      strategyDetail: "Inform with clear return guidelines",
      aiReply: "Our standard retail policy allows returns within 30 days of delivery in original packaging for a full refund. Would you like me to guide you through creating a prepaid return label?",
      trajectoryPoint: { turn: "Turn 2", label: "T2", score: 0.1, sentiment: "Neutral" }
    }
  },
  {
    id: "sc-3",
    title: "Scenario 3: Mildly Annoyed",
    badge: "Negative (Mild)",
    badgeColor: "warning",
    description: "Customer checking on delayed delivery status with moderate concern.",
    inputPrompt: "My order is late. Can you tell me what's happening?",
    mockResponse: {
      sentiment: "negative",
      confidence: 0.84,
      emotion: "Concerned",
      intent: "Delivery Status Inquiry",
      aspect: "Delivery",
      priority: "medium",
      escalate: false,
      strategy: "Acknowledge & Inform",
      strategyDetail: "Acknowledge delay with empathy and provide tracking update",
      aiReply: "I completely understand your concern when an order is delayed. According to carrier records, your package was briefly held at the regional sorting hub and is scheduled for delivery tomorrow afternoon.",
      trajectoryPoint: { turn: "Turn 2", label: "T2", score: -0.45, sentiment: "Negative" }
    }
  },
  {
    id: "sc-4",
    title: "Scenario 4: Repeated Complaint",
    badge: "Escalation",
    badgeColor: "danger",
    description: "Customer contacts support again after previous unresolved complaint.",
    inputPrompt: "My order is still late. I've already contacted support twice. Nobody is helping.",
    mockResponse: {
      sentiment: "negative",
      confidence: 0.97,
      emotion: "Frustrated",
      intent: "Repeated Delivery Complaint",
      aspect: "Delivery",
      priority: "high",
      escalate: true,
      escalationReason: "Customer has expressed repeated frustration and the issue remains unresolved after multiple attempts.",
      escalationTrigger: "Repeated negative sentiment",
      strategy: "Reflect and apologize",
      strategyDetail: "Reflect frustration and escalate to human agent immediately",
      aiReply: "I sincerely apologize that you've had to reach out multiple times without a resolution. That is not the standard of service we aim to provide. I have flagged your order for immediate supervisor review and connected this chat to our priority human queue.",
      trajectoryPoint: { turn: "Turn 4", label: "T4", score: -0.94, sentiment: "Severe Negative" }
    }
  },
  {
    id: "sc-5",
    title: "Scenario 5: Mixed Sentiment",
    badge: "Mixed",
    badgeColor: "warning",
    description: "Product is loved (+), but delivery experience was terrible (-).",
    inputPrompt: "I love the headphones, but the delivery experience was terrible.",
    mockResponse: {
      sentiment: "mixed",
      confidence: 0.91,
      emotion: "Conflicted",
      intent: "Delivery Grievance & Product Praise",
      aspect: "Delivery",
      aspectBreakdown: [
        { aspect: "Product", sentiment: "positive", note: "Loves headphones" },
        { aspect: "Delivery", sentiment: "negative", note: "Terrible courier delivery" }
      ],
      priority: "medium",
      escalate: false,
      strategy: "Acknowledge & Validate",
      strategyDetail: "Separate product appreciation from delivery grievance",
      aiReply: "I'm so glad the headphones themselves are great, but I am very sorry that the delivery experience fell short. We take carrier accountability seriously—I have logged feedback against the courier partner and can issue a courtesy credit for the inconvenience.",
      trajectoryPoint: { turn: "Turn 2", label: "T2", score: -0.2, sentiment: "Mixed" }
    }
  },
  {
    id: "sc-6",
    title: "Scenario 6: Refund Demand",
    badge: "High Priority",
    badgeColor: "danger",
    description: "Direct demand for immediate monetary refund.",
    inputPrompt: "I want a refund right now.",
    mockResponse: {
      sentiment: "negative",
      confidence: 0.95,
      emotion: "Demanding",
      intent: "Refund Demand",
      aspect: "Price",
      priority: "high",
      escalate: true,
      escalationReason: "Customer requesting immediate refund override requiring human financial authorization.",
      escalationTrigger: "Direct financial refund demand",
      strategy: "De-escalate & Route",
      strategyDetail: "Explain return timeline transparently without claiming refund is issued",
      aiReply: "I understand you are seeking an immediate refund. Because financial transactions require verification of return receipt under our store policy, I have forwarded your request directly to our human billing specialist who can review your order for priority approval.",
      trajectoryPoint: { turn: "Turn 3", label: "T3", score: -0.88, sentiment: "Negative" }
    }
  },
  {
    id: "sc-7",
    title: "Scenario 7: Legal / Fraud / Safety",
    badge: "Immediate Escalation",
    badgeColor: "danger",
    description: "Customer reports unauthorized or fraudulent transaction.",
    inputPrompt: "I think this transaction is fraudulent.",
    mockResponse: {
      sentiment: "negative",
      confidence: 0.99,
      emotion: "Alarmed",
      intent: "Fraud / Security Alert",
      aspect: "Service",
      priority: "high",
      escalate: true,
      escalationReason: "Fraudulent or unauthorized transaction claim requires immediate security intervention.",
      escalationTrigger: "Fraud / Safety threshold reached",
      strategy: "Immediate Escalation",
      strategyDetail: "Freeze shipment and transfer to Trust & Safety team immediately",
      aiReply: "We take unauthorized transactions extremely seriously. I have immediately frozen shipment dispatch on this order to protect your funds, and routed your ticket to our senior Trust & Safety team for urgent verification.",
      trajectoryPoint: { turn: "Turn 1", label: "T1", score: -0.98, sentiment: "Critical Negative" }
    }
  }
];

// Helper to simulate AI analysis for user-entered text
export function simulateAiAnalysis(userInput) {
  const text = userInput.toLowerCase();

  // Match demo scenario if exact or close
  for (const sc of DEMO_SCENARIOS) {
    if (text.includes(sc.inputPrompt.toLowerCase().slice(0, 15))) {
      return {
        aiReply: sc.mockResponse.aiReply,
        sentiment: sc.mockResponse.sentiment,
        confidence: sc.mockResponse.confidence,
        emotion: sc.mockResponse.emotion,
        intent: sc.mockResponse.intent,
        aspect: sc.mockResponse.aspect,
        aspectBreakdown: sc.mockResponse.aspectBreakdown || null,
        priority: sc.mockResponse.priority,
        escalate: sc.mockResponse.escalate,
        escalationReason: sc.mockResponse.escalationReason || "Automated escalation threshold triggered by customer message.",
        escalationTrigger: sc.mockResponse.escalationTrigger || "Negative customer sentiment pattern",
        strategyAction: sc.mockResponse.strategyDetail || (sc.mockResponse.sentiment === "negative" ? "Reflect and apologize" : sc.mockResponse.sentiment === "positive" ? "Affirm" : "Inform"),
        trajectoryScore: sc.mockResponse.trajectoryPoint.score
      };
    }
  }

  // Keyword-based dynamic analysis
  if (text.includes("fraud") || text.includes("unauthorized") || text.includes("stolen") || text.includes("scam") || text.includes("lawsuit") || text.includes("lawyer")) {
    return {
      aiReply: "We take security and legal concerns with the utmost urgency. I have locked this order from further processing and dispatched an urgent alert to our senior Trust & Safety security lead.",
      sentiment: "negative",
      confidence: 0.98,
      emotion: "Alarmed",
      intent: "Fraud & Safety Alert",
      aspect: "Service",
      aspectBreakdown: [{ aspect: "Service", sentiment: "negative", note: "Security concern" }],
      priority: "high",
      escalate: true,
      escalationReason: "Security/fraud risk keywords detected in customer message.",
      escalationTrigger: "Safety risk flag",
      strategyAction: "Emergency Escalation",
      trajectoryScore: -0.95
    };
  }

  if (text.includes("refund") || text.includes("money back") || text.includes("cancel")) {
    return {
      aiReply: "I understand you are requesting a refund. Our policy requires a brief inspection upon return delivery, but I have noted your request so our support agent can verify eligibility right away.",
      sentiment: "negative",
      confidence: 0.91,
      emotion: "Frustrated",
      intent: "Refund Request",
      aspect: "Price",
      aspectBreakdown: [{ aspect: "Price", sentiment: "negative", note: "Refund requested" }],
      priority: "high",
      escalate: true,
      escalationReason: "Customer requested financial compensation / refund.",
      escalationTrigger: "Direct financial refund intent",
      strategyAction: "De-escalate & Route to Billing",
      trajectoryScore: -0.75
    };
  }

  if (text.includes("late") || text.includes("where is") || text.includes("not arrived") || text.includes("tracking") || text.includes("delay") || text.includes("wait")) {
    return {
      aiReply: "I apologize for the delay you've experienced with your delivery. I've pulled up your carrier tracking details to investigate the transit timeline and ensure this is resolved promptly.",
      sentiment: "negative",
      confidence: 0.88,
      emotion: "Frustrated",
      intent: "Delivery Complaint",
      aspect: "Delivery",
      aspectBreakdown: [{ aspect: "Delivery", sentiment: "negative", note: "Delayed in transit" }],
      priority: "high",
      escalate: true,
      escalationReason: "Repeated customer frustration with delayed shipment.",
      escalationTrigger: "Delivery delay complaint",
      strategyAction: "Reflect and apologize",
      trajectoryScore: -0.85
    };
  }

  if (text.includes("speak to someone") || text.includes("human") || text.includes("agent") || text.includes("representative") || text.includes("person") || text.includes("manager")) {
    return {
      aiReply: "I completely respect that you'd like to speak directly with a human team member. I am packaging our conversation history and routing you to the next available agent right now.",
      sentiment: "negative",
      confidence: 0.93,
      emotion: "Frustrated",
      intent: "Human Agent Request",
      aspect: "Service",
      aspectBreakdown: [{ aspect: "Service", sentiment: "negative", note: "Prefers human representative" }],
      priority: "high",
      escalate: true,
      escalationReason: "Customer explicitly requested a live human agent.",
      escalationTrigger: "Explicit human handoff requested",
      strategyAction: "Immediate Human Handoff",
      trajectoryScore: -0.90
    };
  }

  if (text.includes("love") || text.includes("great") || text.includes("awesome") || text.includes("thank") || text.includes("amazing") || text.includes("perfect")) {
    return {
      aiReply: "Thank you so much for the wonderful feedback! We love hearing when our products deliver a great experience. Please let us know if there's anything else we can do for you.",
      sentiment: "positive",
      confidence: 0.96,
      emotion: "Delighted",
      intent: "Customer Feedback",
      aspect: "Product",
      aspectBreakdown: [{ aspect: "Product", sentiment: "positive", note: "Positive reception" }],
      priority: "low",
      escalate: false,
      escalationReason: null,
      escalationTrigger: null,
      strategyAction: "Affirm and delight",
      trajectoryScore: 0.85
    };
  }

  // Default neutral / informative response
  return {
    aiReply: "Thank you for sharing those details. I've noted this in your customer profile and am checking our system to provide you with the most accurate resolution.",
    sentiment: "neutral",
    confidence: 0.82,
    emotion: "Inquiring",
    intent: "General Support Inquiry",
    aspect: "Service",
    aspectBreakdown: [{ aspect: "Service", sentiment: "neutral", note: "General inquiry" }],
    priority: "medium",
    escalate: false,
    escalationReason: null,
    escalationTrigger: null,
    strategyAction: "Inform",
    trajectoryScore: 0.05
  };
}
