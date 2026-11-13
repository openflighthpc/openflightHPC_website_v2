export type MdastNode = {
   type: string;
   meta?: string;
   labels?: string[];
   label?: string;
   value?: string;
   data?: {
      hName?: string;
      hProperties?: Record<string, unknown>;
   };
   children?: MdastNode[];
};
