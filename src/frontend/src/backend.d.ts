import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Comment {
    id: number;
    userName: string;
    contentId: string;
    text: string;
    userPid: Principal;
    timestamp: Time;
}
export interface Progress {
    contentId: string;
    lastAccessed: Time;
    position: number;
}
export interface ContentItem {
    id: string;
    uploaderPid: Principal;
    title: string;
    contentType: Variant_audio_story;
    thumbnailBlobId?: ExternalBlob;
    createdAt: Time;
    authorName: string;
    description: string;
    genre: string;
    blobId?: ExternalBlob;
    textContent: string;
}
export interface ContentItemWithLikes {
    id: string;
    uploaderPid: Principal;
    title: string;
    likeCount: number;
    contentType: Variant_audio_story;
    thumbnailBlobId?: ExternalBlob;
    createdAt: Time;
    authorName: string;
    description: string;
    genre: string;
    blobId?: ExternalBlob;
    textContent: string;
}
export interface UserProfile {
    bio?: string;
    name: string;
    email?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_audio_story {
    audio = "audio",
    story = "story"
}
export interface backendInterface {
    addComment(contentId: string, userName: string, text: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookmarkContent(contentId: string): Promise<void>;
    getAllContent(): Promise<Array<ContentItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommentsForContent(contentId: string): Promise<Array<Comment>>;
    getContentByType(contentType: Variant_audio_story): Promise<Array<ContentItem>>;
    getLikeCount(contentId: string): Promise<number | null>;
    getProgress(contentId: string): Promise<Progress | null>;
    getRecentUploads(): Promise<Array<ContentItem>>;
    getTrendingContent(): Promise<Array<ContentItemWithLikes>>;
    getUserBookmarks(): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    likeContent(contentId: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveProgress(contentId: string, position: number): Promise<void>;
    searchContentByTitle(searchTerm: string): Promise<Array<ContentItem>>;
    unbookmarkContent(contentId: string): Promise<void>;
    unlikeContent(contentId: string): Promise<boolean>;
    uploadContent(content: ContentItem): Promise<void>;
}
