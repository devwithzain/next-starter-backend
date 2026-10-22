export type TmailData = {
   user: {
      name: string;
      email: string;
   };
   url: string;
};

export type TmailTokenData = {
   user: {
      name: string;
      email: string;
   };
   token: string;
};

export type TwoFactorData = {
   totpURI: string;
   backupCodes: string[];
};

export type ProfileUpdateFormType = {
   name?: string;
   email?: string;
   image?: string | null | undefined;
};

export type StripePlan = {
   name: string;
   displayName: string;
   priceId: string;
   price: number;
   interval: "month" | "year";
   features: string[];
   limits: {
      projects: number;
      storage: number;
      apiCalls: number;
   };
   popular?: boolean;
   trialDays?: number;
};

export type SignUpFormProps = {
   callbackUrl?: string;
} & React.ComponentProps<"div">;

export type RecentGenerationsProps = {
   images: {
      id: string;
      imageUrl: string;
      prompt: string;
      style: string | null;
      aspectRatio: string | null;
      createdAt: Date;
   }[];
};

export type DashboardStatsProps = {
   stats: {
      totalImages: number;
      creditsUsed: number;
      creditsLimit: number;
      creditsRemaining: number;
      plan: string;
   };
};

export type GeneratedImageResult = {
   id: string;
   imageUrl: string;
   prompt: string;
   enhancedPrompt: string;
   style: string;
   aspectRatio: string;
   width: number;
   height: number;
};

export type Credits = {
   used: number;
   limit: number;
   remaining: number;
};

export type PolicyCardProps = {
   number: number;
   title: string;
   children: React.ReactNode;
};

export type BillingViewProps = {
   initialData: {
      localSubscriptions: any[];
      paymentMethods: any[];
      stripeSubscriptions: any[];
      hasStripeCustomer: boolean;
   };
};

export type Property = {
   slug: string;
   title: string;
   price: string;
   beds: number;
   baths: number;
   receptions: number;
   status: string;
   image: string;
   lat?: number;
   lng?: number;
};

export type SectionCardsProps = {
   stats?: {
      totalRevenue?: number | string;
      activeBookings?: number;
      completedServices?: number;
      totalVehicles?: number;
   };
};

export type AppointmentStatus =
   | "pending"
   | "confirmed"
   | "in_progress"
   | "completed"
   | "cancelled"
   | "quote_requested"
   | "quote_sent"
   | "quote_rejected";

export type PaymentStatus =
   | "pending"
   | "paid"
   | "refunded"
   | "failed"
   | "quote_pending";

export type Mechanic = {
   id: string;
   name: string;
   email?: string | null;
   phone?: string | null;
   specialty?: string | null;
   vanNumber?: string | null;
   workingHours?: string | null;
   isActive: boolean;
   activeBookingsCount: number;
   status: "available" | "on_callout" | "off_duty";
   createdAt?: string | Date;
};

export type Appointment = {
   id: string;
   bookingReference: string;
   customerName: string;
   customerEmail: string;
   customerPhone?: string | null;
   vehicleSummary: string;
   mechanicId?: string | null;
   mechanic?: Mechanic | null;
   postcode: string;
   serviceLocation?: string | null;
   scheduledDate: string;
   scheduledTime: string;
   status: AppointmentStatus;
   callOutFee: string;
   subtotalAmount: string;
   totalAmount: string;
   paymentStatus: PaymentStatus;
   paymentMethod?: string | null;
   notes?: string | null;
   services: string[];
   createdAt: string;
};

export type Service = {
   id: string;
   title: string;
   slug: string;
   description?: string | null;
   price: string;
   isPlusParts: boolean;
   category: string;
   icon?: string | null;
   imageUrl?: string | null;
   durationMinutes: number;
   isActive: boolean;
   createdAt?: string | Date;
   updatedAt?: string | Date;
};

export type Vehicle = {
   id: string;
   userId?: string | null;
   registration: string;
   make: string;
   model: string;
   year?: number | null;
   engineSize?: string | null;
   fuelType?: string | null;
   color?: string | null;
   customerName?: string | null;
   customerEmail?: string | null;
   createdAt?: string | Date;
   updatedAt?: string | Date;
};

export type ContactInquiry = {
   id: string;
   fullName: string;
   email: string;
   phone: string;
   registrationNumber?: string | null;
   message: string;
   status: "new" | "contacted" | "resolved" | "archived";
   adminNotes?: string | null;
   createdAt: string;
   updatedAt?: string;
};