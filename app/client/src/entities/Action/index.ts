import type { EmbeddedRestDatasource } from "entities/Datasource";
import type { DynamicPath } from "utils/DynamicBindingUtils";
import _ from "lodash";
import type { LayoutOnLoadActionErrors } from "constants/AppsmithActionConstants/ActionConstants";
import type { Plugin } from "api/PluginApi";
import type { AutoGeneratedHeader } from "pages/Editor/APIEditor/helpers";
import type { EventLocation } from "@appsmith/utils/analyticsUtilTypes";
import type { ActionParentEntityTypeInterface } from "@appsmith/entities/Engine/actionHelpers";

export enum PluginType {
  API = "API",
  DB = "DB",
  SAAS = "SAAS",
  JS = "JS",
  REMOTE = "REMOTE",
  AI = "AI",
  INTERNAL = "INTERNAL",
}

export enum PluginPackageName {
  POSTGRES = "postgres-plugin",
  MONGO = "mongo-plugin",
  S3 = "amazons3-plugin",
  GOOGLE_SHEETS = "google-sheets-plugin",
  FIRESTORE = "firestore-plugin",
  REST_API = "restapi-plugin",
  GRAPHQL = "graphql-plugin",
  JS = "js-plugin",
  ORACLE = "oracle-plugin",
  MY_SQL = "mysql-plugin",
  MS_SQL = "mssql-plugin",
  SNOWFLAKE = "snowflake-plugin",
  APPSMITH_AI = "appsmithai-plugin",
  WORKFLOW = "workflow-plugin",
}

// more can be added subsequently.
export enum PluginName {
  MONGO = "MongoDB",
  POSTGRES = "PostgreSQL",
  MY_SQL = "MySQL",
  MS_SQL = "Microsoft SQL Server",
  GOOGLE_SHEETS = "Google Sheets",
  FIRESTORE = "Firestore",
  ORACLE = "Oracle",
  SNOWFLAKE = "Snowflake",
  ARANGODB = "ArangoDB",
  REDSHIFT = "Redshift",
  SMTP = "SMTP",
  REST_API = "REST API",
  REDIS = "Redis",
  AIRTABLE = "Airtable",
  TWILIO = "Twilio",
  HUBSPOT = "HubSpot",
  ELASTIC_SEARCH = "Elasticsearch",
  GRAPHQL = "Authenticated GraphQL API",
  OPEN_AI = "Open AI",
  APPSMITH_AI = "Appsmith AI",
}

export enum PaginationType {
  NONE = "NONE",
  PAGE_NO = "PAGE_NO",
  URL = "URL",
  CURSOR = "CURSOR",
}

export interface KeyValuePair {
  key?: string;
  value?: unknown;
}

export interface LimitOffset {
  limit: Record<string, unknown>;
  offset: Record<string, unknown>;
}
export interface SelfReferencingData {
  limitBased?: LimitOffset;
  curserBased?: {
    previous?: LimitOffset;
    next?: LimitOffset;
  };
}

export interface ActionConfig {
  timeoutInMillisecond?: number;
  paginationType?: PaginationType;
  formData?: Record<string, unknown>;
  pluginSpecifiedTemplates?: KeyValuePair[];
  path?: string;
  queryParameters?: KeyValuePair[];
  selfReferencingData?: SelfReferencingData;
}

export interface ActionProvider {
  name: string;
  imageUrl: string;
  url: string;
  description: string;
  credentialSteps: string;
}

export interface Property {
  key: string;
  value: string;
}

export interface BodyFormData {
  editable: boolean;
  mandatory: boolean;
  description: string;
  key: string;
  value?: string;
  type: string;
}

export interface ApiActionConfig extends Omit<ActionConfig, "formData"> {
  headers: Property[];
  autoGeneratedHeaders?: AutoGeneratedHeader[];
  httpMethod: string;
  httpVersion: string;
  path?: string;
  body?: JSON | string | Record<string, any> | null;
  encodeParamsToggle: boolean;
  queryParameters?: Property[];
  bodyFormData?: BodyFormData[];
  formData: Record<string, unknown>;
  query?: string | null;
  variable?: string | null;
}

export interface QueryActionConfig extends ActionConfig {
  body?: string;
}

export const isStoredDatasource = (val: any): val is StoredDatasource => {
  if (!_.isObject(val)) return false;
  if (!("id" in val)) return false;
  return true;
};
export interface StoredDatasource {
  name?: string;
  id: string;
  pluginId?: string;
  datasourceConfiguration?: { url?: string };
}

export interface BaseAction {
  id: string;
  name: string;
  workspaceId: string;
  pageId: string;
  collectionId?: string;
  pluginId: string;
  executeOnLoad: boolean;
  dynamicBindingPathList: DynamicPath[];
  isValid: boolean;
  invalids: string[];
  jsonPathKeys: string[];
  cacheResponse: string;
  confirmBeforeExecute?: boolean;
  eventData?: any;
  messages: string[];
  userPermissions?: string[];
  errorReports?: Array<LayoutOnLoadActionErrors>;
  isPublic?: boolean;
  moduleId?: string;
  moduleInstanceId?: string;
  workflowId?: string;
  contextType?: ActionParentEntityTypeInterface;
  // This is used to identify the main js collection of a workflow
  // added here to avoid ts error in entitiesSelector file, in practice
  // will always be undefined for non js actions
  isMainJSCollection?: boolean;
}

interface BaseApiAction extends BaseAction {
  pluginType: PluginType.API;
  actionConfiguration: ApiActionConfig;
}
export interface SaaSAction extends BaseAction {
  pluginType: PluginType.SAAS;
  actionConfiguration: any;
  datasource: StoredDatasource;
}
export interface RemoteAction extends BaseAction {
  pluginType: PluginType.REMOTE;
  actionConfiguration: any;
  datasource: StoredDatasource;
}
export interface AIAction extends BaseAction {
  pluginType: PluginType.AI;
  actionConfiguration: any;
  datasource: StoredDatasource;
}
export interface InternalAction extends BaseAction {
  pluginType: PluginType.INTERNAL;
  actionConfiguration: any;
  datasource: StoredDatasource;
}

export interface EmbeddedApiAction extends BaseApiAction {
  datasource: EmbeddedRestDatasource;
}

export interface StoredDatasourceApiAction extends BaseApiAction {
  datasource: StoredDatasource;
}

export type ApiAction = EmbeddedApiAction | StoredDatasourceApiAction;

export type RapidApiAction = ApiAction & {
  templateId: string;
  proverId: string;
  provider: ActionProvider;
  pluginId: string;
  documentation: { text: string };
};

export interface QueryAction extends BaseAction {
  pluginType: PluginType.DB;
  pluginName?: PluginName;
  actionConfiguration: QueryActionConfig;
  datasource: StoredDatasource;
}

export interface ActionViewMode {
  id: string;
  name: string;
  pageId: string;
  jsonPathKeys: string[];
  confirmBeforeExecute?: boolean;
  timeoutInMillisecond?: number;
}

export type Action =
  | ApiAction
  | QueryAction
  | SaaSAction
  | RemoteAction
  | AIAction
  | InternalAction;

export enum SlashCommand {
  NEW_API,
  NEW_QUERY,
  NEW_INTEGRATION,
  ASK_AI,
}

export interface SlashCommandPayload {
  actionType: SlashCommand;
  callback?: (binding: string) => void;
  args: any;
}

export function isAPIAction(action: Action): action is ApiAction {
  return action.pluginType === PluginType.API;
}

export function isQueryAction(action: Action): action is QueryAction {
  return action.pluginType === PluginType.DB;
}

export function isSaaSAction(action: Action): action is SaaSAction {
  return action.pluginType === PluginType.SAAS;
}

export function isAIAction(action: Action): action is SaaSAction {
  return action.pluginType === PluginType.AI;
}

export function getGraphQLPlugin(plugins: Plugin[]): Plugin | undefined {
  return plugins.find((p) => p.packageName === PluginPackageName.GRAPHQL);
}

export function getAppsmithAIPlugin(plugins: Plugin[]): Plugin | undefined {
  return plugins.find((p) => p.packageName === PluginPackageName.APPSMITH_AI);
}

export function isGraphqlPlugin(plugin: Plugin | undefined) {
  return plugin?.packageName === PluginPackageName.GRAPHQL;
}

export function isRESTAPIPlugin(plugin: Plugin | undefined) {
  return plugin?.packageName === PluginPackageName.REST_API;
}

export const SCHEMA_SECTION_ID = "t--api-right-pane-schema";

export interface CreateApiActionDefaultsParams {
  apiType: string;
  from?: EventLocation;
  newActionName?: string;
}

export interface CreateActionDefaultsParams {
  datasourceId: string;
  from?: EventLocation;
  newActionName?: string;
  queryDefaultTableName?: string;
}
