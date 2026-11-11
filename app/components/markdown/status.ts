export const STATUS_TAGS = {
   active: 'In Progress',
   complete: 'Completed',
   archived: 'Archived',

} as const;

export const STATUS_COLOR = {
   active: 'text-lime-300 border-lime-400/30 bg-lime-400/5',
   complete: 'text-lime-500 border-lime-500/20 bg-lime-500/5',
   archived: 'text-neutral-400 border-neutral-600 bg-neutral-900'
} as const;
