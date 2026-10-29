import {
   IconDashboard,
   IconUser,
   IconShoppingBag,
   IconHeart,
   IconShirt,
   IconReceipt,
   IconTruckDelivery,
   IconTicket,
   IconCash,
   IconSettings,
   IconBriefcase,
   IconHelpCircle,
   IconNews,
   IconUsers,
   IconMail,
   IconSettings2,
} from "@tabler/icons-react";

export const sidebarData = {
   userNav: [
      {
         items: [
            {
               title: "Dashboard",
               url: "/dashboard",
               icon: IconDashboard,
            },
         ],
      },
      {
         group: "My Account",
         items: [
            {
               title: "Profile & Settings",
               url: "/dashboard/settings",
               icon: IconUser,
            },
            {
               title: "My Account & Orders",
               url: "/account",
               icon: IconReceipt,
            },
            {
               title: "Shopping Cart",
               url: "/cart",
               icon: IconShoppingBag,
            },
            {
               title: "Wishlist",
               url: "/wishlist",
               icon: IconHeart,
            },
         ],
      },
      {
         group: "Seller Management",
         items: [
            {
               title: "My Store Products",
               url: "/dashboard/products",
               icon: IconShirt,
            },
            {
               title: "Store Orders & Fulfillment",
               url: "/dashboard/orders",
               icon: IconTruckDelivery,
            },
            {
               title: "Country Shipping Rates",
               url: "/dashboard/shipping",
               icon: IconTruckDelivery,
            },
            {
               title: "Store Coupons",
               url: "/dashboard/coupons",
               icon: IconTicket,
            },
            {
               title: "Payouts & Withdrawals",
               url: "/dashboard/withdrawals",
               icon: IconCash,
            },
         ],
      },
   ],

   adminNav: [
      {
         items: [
            {
               title: "Dashboard",
               url: "/dashboard",
               icon: IconDashboard,
            },
         ],
      },
      {
         group: "Website Content",
         items: [
            {
               title: "Our Services",
               url: "/dashboard/services",
               icon: IconBriefcase,
            },
            {
               title: "FAQs",
               url: "/dashboard/faqs",
               icon: IconHelpCircle,
            },
            {
               title: "Blog & Articles",
               url: "/dashboard/blogs",
               icon: IconNews,
            },
         ],
      },
      {
         group: "User Management",
         items: [
            {
               title: "Users & Roles",
               url: "/dashboard/users",
               icon: IconUsers,
            },
            {
               title: "Customer Inquiries",
               url: "/dashboard/inquiries",
               icon: IconMail,
            },
            {
               title: "Newsletter Subscribers",
               url: "/dashboard/subscribers",
               icon: IconMail,
            },
         ],
      },
      {
         group: "Website Settings",
         items: [
            {
               title: "Website Configuration",
               url: "/dashboard/config",
               icon: IconSettings2,
            },
         ],
      },
   ],
};