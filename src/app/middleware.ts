import withAuth from 'next-auth/middleware'
export { withAuth } from "next-auth/middleware"

export default withAuth({
  // Matches the pages config in `[...nextauth]`
  pages: {
    signIn: "/",
    signOut: "/",
  },
})
 
export const config = {
  matcher: [
    '/api/initialPath',
    '/api/command'
  ],
}