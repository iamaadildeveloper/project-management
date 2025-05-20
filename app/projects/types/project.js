/**
 * @typedef {Object} Project
 * @property {string} id - The unique identifier for the project
 * @property {string} userId - The ID of the user who owns the project
 * @property {string} title - The title of the project
 * @property {string} client - The client name for the project
 * @property {string} description - The project description
 * @property {'not_started'|'in_progress'|'completed'} status - The current status of the project
 * @property {boolean} completed - Whether the project is completed
 * @property {string} projectURL - URL associated with the project
 * @property {number} [revenue] - Optional revenue amount for the project
 * @property {string} [dueDate] - Optional due date for the project
 * @property {string} createdAt - When the project was created (ISO date string)
 * @property {string} [updatedAt] - When the project was last updated (ISO date string)
 */