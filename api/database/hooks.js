import ProjectActivityParticipants from './models/project-activity.participants.js';
import CoreActivityParticipants from './models/core-activity.participants.js';
import Client from './models/client.js';
import ProjectActivity from './models/project-activity.js';
import CoreActivity from './models/core-activity.js';
import HarmReduction from './models/harm-reduction.js';
import {getAge } from '../utils/index.js';


// Update number of clients in Core Activity after create
CoreActivityParticipants.afterCreate(async (core_activity_participant) => {
  const core_activity = await CoreActivity.findByPk(
    core_activity_participant.core_activity_id
  );
  const client = await Client.findByPk(core_activity_participant.client_id);
  if (core_activity && client) {
    core_activity.increment('number_of_clients', { by: 1 });
  }
});

// Update number of clients in Core Activity after delete
CoreActivityParticipants.afterDestroy(async (core_activity_participant) => {
  const core_activity = await CoreActivity.findByPk(
    core_activity_participant.core_activity_id
  );
  const client = await Client.findByPk(core_activity_participant.client_id);
  if (core_activity && client) {
    core_activity.decrement('number_of_clients', { by: 1 });
  }
});

// Update number of clients in Core Activity after bulk create
CoreActivityParticipants.afterBulkCreate(async (core_activity_participants) => {
  const core_activity = await CoreActivity.findByPk(
    core_activity_participants[0].core_activity_id
  );
  if (core_activity) {
    core_activity.increment('number_of_clients', {
      by: core_activity_participants.length
    });
  }
});

// Update number of clients in Core Activity after bulk delete
CoreActivityParticipants.afterBulkDestroy(async (options) => {
  const core_activity = await CoreActivity.findByPk(
    options.where.core_activity_id
  );
  if (core_activity) {
    const { count } = await CoreActivityParticipants.findAndCountAll({
      where: {
        core_activity_id: options.where.core_activity_id
      }
    });
    core_activity.update({ number_of_clients: count });
  }
});

// Update number of clients in Project Activity after create
ProjectActivityParticipants.afterCreate(
  async (project_activity_participant) => {
    const project_activity = await ProjectActivity.findByPk(
      project_activity_participant.project_activity_id
    );
    const client = await Client.findByPk(
      project_activity_participant.client_id
    );
    if (project_activity && client) {
      project_activity.increment('number_of_clients', { by: 1 });
    }
  }
);

// Update number of clients in Project Activity after delete
ProjectActivityParticipants.afterDestroy(
  async (project_activity_participant) => {
    const project_activity = await ProjectActivity.findByPk(
      project_activity_participant.project_activity_id
    );
    const client = await Client.findByPk(
      project_activity_participant.client_id
    );
    if (project_activity && client) {
      project_activity.decrement('number_of_clients', { by: 1 });
    }
  }
);

// Update number of clients in Project Activity after bulk create
ProjectActivityParticipants.afterBulkCreate(
  async (project_activity_participants) => {
    const project_activity = await ProjectActivity.findByPk(
      project_activity_participants[0].project_activity_id
    );
    if (project_activity) {
      project_activity.increment('number_of_clients', {
        by: project_activity_participants.length
      });
    }
  }
);

// Update number of clients in Project Activity after bulk delete
ProjectActivityParticipants.afterBulkDestroy(async (options) => {
  const project_activity = await ProjectActivity.findByPk(
    options.where.project_activity_id
  );
  if (project_activity) {
    const { count } = await ProjectActivityParticipants.findAndCountAll({
      where: {
        project_activity_id: options.where.project_activity_id
      }
    });
    project_activity.update({ number_of_clients: count });
  }
});

// Before Delete Client, delete all related project activity participants and core activity participants
Client.beforeDestroy(async (client) => {
  const harm_reduction_records = HarmReduction.destroy({
    where: { client_id: client.id }
  });

  const project_activity_participants = ProjectActivityParticipants.destroy({
    where: { client_id: client.id }
  });

  const core_activity_participants = CoreActivityParticipants.destroy({
    where: { client_id: client.id }
  });

  Promise.all([
    harm_reduction_records,
    project_activity_participants,
    core_activity_participants
  ]);
});

// Calculate age group after find if date of birth is present
Client.afterFind(async (clients) => {
  if (Array.isArray(clients)) {
    clients.forEach((client) => {
      if (client.date_of_birth) {
        client.dataValues.age = getAge(client.date_of_birth);
      }
    });
  } else {
    if (clients.date_of_birth) {
      clients.dataValues.age = getAge(clients.date_of_birth);
    }
  }
});

// Update Harm Reduction records after updating client details
Client.afterUpdate(async (client) => {
  const harm_reduction_records = await HarmReduction.findAll({
    where: { client_id: client.id }
  });

  harm_reduction_records.forEach((record) => {
    record.update({
      client_initials: client.first_name[0] + client.last_name[0],
      gender: client.gender,
      year_of_birth: client.date_of_birth
        ? new Date(client.date_of_birth).getFullYear()
        : record.year_of_birth
    });
  });
});

// Before Delete Project Activity, delete all related project activity participants
ProjectActivity.beforeDestroy(async (project_activity) => {
  await ProjectActivityParticipants.destroy({
    where: { project_activity_id: project_activity.id },
    hooks: false
  });
});

// Before Delete Core Activity, delete all related core activity participants
CoreActivity.beforeDestroy(async (core_activity) => {
  await CoreActivityParticipants.destroy({
    where: { core_activity_id: core_activity.id },
    hooks: false
  });
});
