import { getItems } from "./storage";
import { Streamer } from "./streamer";
import md5 from "md5";
import { ISource } from "./source/source";

export const KEY_REPEAT_THROW = "repeat_throw_threshold";
export const KEY_REPEAT_WORD = "repeat_word_threshold";
export const KEY_POST_FLOOD = "post_flood_threshold";
export const KEY_LENGTH = "length_threshold";
export const KEY_USER_LENGTH = "length_user_threshold";
export const KEY_LOOK_CHATS = "look_chats";
export const KEY_EXECUTION_INTERVAL = "execution_interval";
export const KEY_NG_WORDS = "ng_words";
export const KEY_IS_SHOW_REASON = "is_show_reason";
export const KEY_IS_ACTIVATE = "is_activate_modekun";
export const KEY_CONSIDER_AUTHOR_NGWORD = "consider_author_ngword";
export const KEY_CONSIDER_AUTHOR_LENGTH = "consider_author_length";
export const KEY_CONSIDER_HIDDEN_EMOJI = "consider_hidden_emoji";
export const KEY_CONSIDER_HIDDEN_SUPER_CHAT = "consider_hidden_super_chat";
export const KEY_CONSIDER_MEMBER_ONLY = "consider_member_only";
export const KEY_IS_HIDE_COMPLETELY = "is_hide_completely";
export const KEY_OUTPUT_DEBUG_LOG = "output_debug_log";

export const paramKeys = () => {
  return [
    KEY_REPEAT_THROW,
    KEY_REPEAT_WORD,
    KEY_POST_FLOOD,
    KEY_LENGTH,
    KEY_USER_LENGTH,
    KEY_LOOK_CHATS,
    KEY_EXECUTION_INTERVAL,
    KEY_NG_WORDS,
    KEY_IS_SHOW_REASON,
    KEY_IS_ACTIVATE,
    KEY_CONSIDER_AUTHOR_NGWORD,
    KEY_CONSIDER_AUTHOR_LENGTH,
    KEY_CONSIDER_HIDDEN_EMOJI,
    KEY_CONSIDER_HIDDEN_SUPER_CHAT,
    KEY_CONSIDER_MEMBER_ONLY,
    KEY_IS_HIDE_COMPLETELY,
    KEY_OUTPUT_DEBUG_LOG,
  ];
};

const DEFAULT_REPEAT_THROW_THRESHOLD = 2;
const DEFAULT_REPEAT_WORD_THRESHOLD = 4;
const DEFAULT_POST_FLOOD_THRESHOLD = 5;
const DEFAULT_LENGTH_THRESHOLD = 512;
const DEFAULT_LENGTH_USER_THRESHOLD = 32;
const DEFAULT_LOOK_CHATS = 50;
const DEFAULT_NG_WORDS: string[] = [];
const DEFAULT_IS_SHOW_REASON = true;
const DEFAULT_IS_ACTIVATE = true;
const DEFAULT_CONSIDER_AUTHOR_NGWORD = false;
const DEFAULT_CONSIDER_AUTHOR_LENGTH = true;
const DEFAULT_CONSIDER_HIDDEN_EMOJI = false;
const DEFAULT_CONSIDER_HIDDEN_SUPER_CHAT = false;
const DEFAULT_CONSIDER_MEMBER_ONLY = false;
const DEFAULT_IS_HIDE_COMPLETELY = false;
const DEFAULT_OUTPUT_DEBUG_LOG = false;
const DEFAULT_IS_FORCE_HIDE = false;

export const DEFAULT_IS_USE_SAME_PARAM = false;

export const DEFAULT_EXECUTION_INTERVAL_MS = 1000;
export const OBSERVATION_INTERVAL_MS = 50;

export const YOUTUBE_REGEX = /https:\/\/www\.youtube\.com.*/;
export const MILDOM_REGEX = /https:\/\/www\.mildom\.com.*/;
export const TWITCH_REGEX = /https:\/\/www\.twitch\.tv.*/;

export const defaultParams: IParameter = {
  [KEY_REPEAT_THROW]: DEFAULT_REPEAT_THROW_THRESHOLD,
  [KEY_REPEAT_WORD]: DEFAULT_REPEAT_WORD_THRESHOLD,
  [KEY_POST_FLOOD]: DEFAULT_POST_FLOOD_THRESHOLD,
  [KEY_LENGTH]: DEFAULT_LENGTH_THRESHOLD,
  [KEY_USER_LENGTH]: DEFAULT_LENGTH_USER_THRESHOLD,
  [KEY_LOOK_CHATS]: DEFAULT_LOOK_CHATS,
  [KEY_EXECUTION_INTERVAL]: DEFAULT_EXECUTION_INTERVAL_MS,
  [KEY_NG_WORDS]: DEFAULT_NG_WORDS,
  [KEY_IS_SHOW_REASON]: DEFAULT_IS_SHOW_REASON,
  [KEY_IS_ACTIVATE]: DEFAULT_IS_ACTIVATE,
  [KEY_CONSIDER_AUTHOR_NGWORD]: DEFAULT_CONSIDER_AUTHOR_NGWORD,
  [KEY_CONSIDER_AUTHOR_LENGTH]: DEFAULT_CONSIDER_AUTHOR_LENGTH,
  [KEY_CONSIDER_HIDDEN_EMOJI]: DEFAULT_CONSIDER_HIDDEN_EMOJI,
  [KEY_CONSIDER_HIDDEN_SUPER_CHAT]: DEFAULT_CONSIDER_HIDDEN_SUPER_CHAT,
  [KEY_CONSIDER_MEMBER_ONLY]: DEFAULT_CONSIDER_MEMBER_ONLY,
  [KEY_IS_HIDE_COMPLETELY]: DEFAULT_IS_HIDE_COMPLETELY,
  [KEY_OUTPUT_DEBUG_LOG]: DEFAULT_OUTPUT_DEBUG_LOG,
};

export interface IParameter {
  repeat_throw_threshold: number;
  repeat_word_threshold: number;
  post_flood_threshold: number;
  length_threshold: number;
  length_user_threshold: number;
  look_chats: number;
  execution_interval: number;
  ng_words: string[];
  is_show_reason: boolean;
  is_activate_modekun: boolean;
  consider_author_ngword: boolean;
  consider_author_length: boolean;
  consider_hidden_emoji: boolean;
  consider_hidden_super_chat: boolean;
  consider_member_only: boolean;
  is_hide_completely: boolean;
  output_debug_log: boolean;
}

export interface IParameterV2 {
  repeatPostThreshold: number;
  repeatWordThreshold: number;
  postFrequencyThreshold: number;
  lengthThreshold: number;
  lengthUserThreshold: number;
  lookChats: number;
  executionInterval: number;
  ngWords: string[];
  isShowReason: boolean;
  isActivateModekun: boolean;
  considerAuthorNgWord: boolean;
  considerAuthorLength: boolean;
  considerHiddenEmoji: boolean;
  considerHiddenSuperChat: boolean;
  considerMemberOnly: boolean;
  isHideCompletely: boolean;
  outputDebugLog: boolean;
  isForceHide: boolean;
}

export const defaultParamsV2: IParameterV2 = {
  repeatPostThreshold: DEFAULT_REPEAT_THROW_THRESHOLD,
  repeatWordThreshold: DEFAULT_REPEAT_WORD_THRESHOLD,
  postFrequencyThreshold: DEFAULT_POST_FLOOD_THRESHOLD,
  lengthThreshold: DEFAULT_LENGTH_THRESHOLD,
  lengthUserThreshold: DEFAULT_LENGTH_USER_THRESHOLD,
  lookChats: DEFAULT_LOOK_CHATS,
  executionInterval: DEFAULT_EXECUTION_INTERVAL_MS,
  ngWords: DEFAULT_NG_WORDS,
  isShowReason: DEFAULT_IS_SHOW_REASON,
  isActivateModekun: DEFAULT_IS_ACTIVATE,
  considerAuthorNgWord: DEFAULT_CONSIDER_AUTHOR_NGWORD,
  considerAuthorLength: DEFAULT_CONSIDER_AUTHOR_LENGTH,
  considerHiddenEmoji: DEFAULT_CONSIDER_HIDDEN_EMOJI,
  considerHiddenSuperChat: DEFAULT_CONSIDER_HIDDEN_SUPER_CHAT,
  considerMemberOnly: DEFAULT_CONSIDER_MEMBER_ONLY,
  isHideCompletely: DEFAULT_IS_HIDE_COMPLETELY,
  outputDebugLog: DEFAULT_OUTPUT_DEBUG_LOG,
  isForceHide: DEFAULT_IS_FORCE_HIDE,
};

export const isParameter = (arg: any): arg is IParameter => {
  return (
    arg.repeat_throw_threshold !== undefined &&
    arg.repeat_word_threshold !== undefined &&
    arg.post_flood_threshold !== undefined &&
    arg.length_threshold !== undefined &&
    arg.length_user_threshold !== undefined &&
    arg.look_chats !== undefined &&
    arg.execution_interval !== undefined &&
    arg.ng_words !== undefined &&
    arg.is_show_reason !== undefined &&
    arg.is_activate_modekun !== undefined &&
    arg.consider_author_ngword !== undefined &&
    arg.consider_author_length !== undefined &&
    arg.consider_hidden_emoji !== undefined &&
    arg.consider_hidden_super_chat !== undefined &&
    arg.consider_member_only !== undefined &&
    arg.is_hide_completely !== undefined &&
    arg.output_debug_log !== undefined
  );
};

export const getNgWords = async (): Promise<string[]> => {
  const ngWordsJson: any = await getItems([KEY_NG_WORDS]);
  if (!ngWordsJson) return [];
  const ngWords = ngWordsJson[KEY_NG_WORDS];
  return Array.isArray(ngWords) ? ngWords : [];
};

export const getParams = async (): Promise<IParameter> => {
  const params = await getItems(paramKeys()).catch((e) => {
    throw e;
  });
  return { ...defaultParams, ...params };
};

export const keyStreamer = (sourceName: string, streamer: Streamer): string => {
  const hashedName = md5(streamer.name);
  return `modekun-${sourceName}-${hashedName}`;
};

export const keyIsUseSameParam = "modekun-is-use-same-param";
