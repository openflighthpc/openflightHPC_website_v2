export const STATUS_TAGS = {
   archived: 'Archived',
   complete: 'Completed',
   'in-progress': 'In Progress'
} as const;

export const STATUS_COLOR = {
   archived: 'text-neutral-400 border-neutral-600 bg-neutral-900',
   complete: 'text-lime-500 border-lime-500/20 bg-lime-500/5',
   'in-progress': 'text-lime-300 border-lime-400/30 bg-lime-400/5'
} as const;
