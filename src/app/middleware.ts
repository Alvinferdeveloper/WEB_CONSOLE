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
    '/api/initial-path',
    '/api/command',
    '/api/files/save-content',
    '/api/files/writable-path',
    '/api/files/get-content',
  ],
}