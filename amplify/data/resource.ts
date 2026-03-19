import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

a.enum(["PENDIENTE", "HACIENDO", "HECHO"]);

const schema = a.schema({
  Task: a
    .model({
      title: a.string().required(),
      description: a.string(),
      status: a.enum(["PENDIENTE", "HACIENDO", "HECHO"]),
      versions: a.json(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
