import 'server-only';
import { redirect } from 'next/navigation';
import { getOrganizationById } from '@cfce/database';

/**
 * Verifies that the user has access to the organization (is owner or isAdmin).
 * Redirects to /dashboard if unauthorized or org not found.
 * @param userId - The authenticated user's ID
 * @param orgId - The organization ID from params
 * @param isAdmin - Whether the user is an admin (from session)
 */
export async function verifyOrgAccess(userId: string, orgId: string, isAdmin: boolean) {
  if (!userId || !orgId) {
    redirect('/dashboard');
  }
  const org = await getOrganizationById(orgId);
  if (!org) {
    redirect('/dashboard');
  }
  // Check if user is owner or admin
  const isOwner = org.ownerId === userId;
  if (!isOwner && !isAdmin) {
    redirect('/dashboard');
  }
  // If here, user is authorized
  return org;
} 