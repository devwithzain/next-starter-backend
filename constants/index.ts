import {
   IconList,
   IconTool,
   IconCar,
   IconUsers,
   IconSettings,
   IconUserCheck,
   IconHelpCircle,
   IconExternalLink,
   IconLayoutDashboard,
   IconClock,
   IconMessageDots,
} from "@tabler/icons-react";

export const sidebarData = {
   navMain: [
      {
         title: "Dashboard",
         url: "/dashboard",
         icon: IconLayoutDashboard,
      },
      {
         title: "Inquiries",
         url: "/dashboard/inquiries",
         icon: IconMessageDots,
      },
      {
         title: "Users",
         url: "/dashboard/users",
         icon: IconUsers,
      },
   ],

   navSecondary: [
      {
         title: "Blogs",
         url: "/dashboard/blogs",
         icon: IconSettings,
      },
      {
         title: "Get Help",
         url: "/contact",
         icon: IconHelpCircle,
      },
   ],

   quickLinks: [
      {
         name: "Book a Service (Client)",
         url: "/book-a-service",
         icon: IconExternalLink,
      },
      {
         name: "Client Pricing",
         url: "/pricing",
         icon: IconExternalLink,
      },
   ],
};