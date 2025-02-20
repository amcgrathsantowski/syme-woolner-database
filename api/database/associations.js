import Employee from './models/employee.js';
import Organization from './models/organization.js';
import ProjectActivityParticipants from './models/project-activity.participants.js';
import CoreActivityParticipants from './models/core-activity.participants.js';
import Client from './models/client.js';
import ProjectActivity from './models/project-activity.js';
import CoreActivity from './models/core-activity.js';
import HarmReduction from './models/harm-reduction.js';

Employee.belongsTo(Organization, { foreignKey: 'org' });
Organization.hasMany(Employee, { foreignKey: 'org' });

Client.hasMany(ProjectActivityParticipants, { foreignKey: 'client_id' });
ProjectActivityParticipants.belongsTo(Client, { foreignKey: 'client_id' });

ProjectActivity.hasMany(ProjectActivityParticipants, {
  foreignKey: 'project_activity_id'
});
ProjectActivityParticipants.belongsTo(ProjectActivity, {
  foreignKey: 'project_activity_id'
});

Client.hasMany(CoreActivityParticipants, { foreignKey: 'client_id' });
CoreActivityParticipants.belongsTo(Client, { foreignKey: 'client_id' });

CoreActivity.hasMany(CoreActivityParticipants, {
  foreignKey: 'core_activity_id'
});
CoreActivityParticipants.belongsTo(CoreActivity, {
  foreignKey: 'core_activity_id'
});

Client.hasMany(HarmReduction, { foreignKey: 'client_id' });
