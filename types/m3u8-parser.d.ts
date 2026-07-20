declare module 'm3u8-parser' {
  export class Parser {
    constructor();
    push(chunk: string): void;
    end(): void;
    manifest: {
      allowCache?: boolean;
      endList?: boolean;
      mediaSequence?: number;
      targetDuration?: number;
      playlists?: Array<{
        attributes: Record<string, any>;
        uri: string;
      }>;
      segments?: Array<{
        duration: number;
        uri: string;
      }>;
    };
  }
}
