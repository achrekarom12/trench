import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

// Role-based access control types
export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN'

export interface RBACOptions {
  allowedRoles: UserRole[]
  requireAll?: boolean // If true, user must have ALL roles (for future multi-role support)
}

// Extend FastifyRequest to include user role
declare module 'fastify' {
  interface FastifyRequest {
    userRole?: UserRole
  }
}

// Role-based access control middleware
export function requireRole(options: RBACOptions) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Get user from JWT token (already authenticated by JWT plugin)
      const user = request.user as any
      
      if (!user || !user.role) {
        return reply.status(401).send({
          success: false,
          error: 'Authentication required'
        })
      }

      const userRole = user.role as UserRole
      
      // Check if user role is in allowed roles
      if (!options.allowedRoles.includes(userRole)) {
        return reply.status(403).send({
          success: false,
          error: `Access denied. Required roles: ${options.allowedRoles.join(', ')}. Your role: ${userRole}`
        })
      }

      // Add user role to request for use in route handlers
      request.userRole = userRole
      
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: 'Authorization check failed'
      })
    }
  }
}

// Convenience functions for common role combinations
export const requireAdmin = () => requireRole({ allowedRoles: ['ADMIN'] })
export const requireFaculty = () => requireRole({ allowedRoles: ['FACULTY'] })
export const requireStudent = () => requireRole({ allowedRoles: ['STUDENT'] })
export const requireFacultyOrAdmin = () => requireRole({ allowedRoles: ['FACULTY', 'ADMIN'] })
export const requireAnyRole = () => requireRole({ allowedRoles: ['STUDENT', 'FACULTY', 'ADMIN'] })

// Plugin registration
export default async function rbacPlugin(fastify: FastifyInstance) {
  // Add RBAC utilities to fastify instance
  fastify.decorate('requireRole', requireRole)
  fastify.decorate('requireAdmin', requireAdmin)
  fastify.decorate('requireFaculty', requireFaculty)
  fastify.decorate('requireStudent', requireStudent)
  fastify.decorate('requireFacultyOrAdmin', requireFacultyOrAdmin)
  fastify.decorate('requireAnyRole', requireAnyRole)
}

// Extend FastifyInstance types
declare module 'fastify' {
  interface FastifyInstance {
    requireRole: typeof requireRole
    requireAdmin: typeof requireAdmin
    requireFaculty: typeof requireFaculty
    requireStudent: typeof requireStudent
    requireFacultyOrAdmin: typeof requireFacultyOrAdmin
    requireAnyRole: typeof requireAnyRole
  }
}
