import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
    signOut: "/",
  },
});

export const config = {
  matcher: ["/app/:path*"],
};
