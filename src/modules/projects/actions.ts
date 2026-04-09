import db from '../../lib/db'

export async function getProjects() {
  try {
    return db.prepare(`
      SELECT p.*, 
      (SELECT COUNT(*) FROM tickets WHERE project_id = p.id) as ticket_count,
      (SELECT COUNT(*) FROM tickets WHERE project_id = p.id AND status = 'OPEN') as open_tickets
      FROM projects p
    `).all() as any[];
  } catch (error) {
    return [];
  }
}