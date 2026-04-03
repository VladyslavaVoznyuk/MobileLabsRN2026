
export const COLORS = {
  bg:           '#0A0A0F',
  surface:      '#13131A',
  surfaceAlt:   '#1A1A24',
  surfaceHover: '#20202E',
  border:       '#252535',
  borderLight:  '#2E2E45',

  accent:    '#6C63FF',
  accentDim: '#3D3880',
  accentGlow:'rgba(108,99,255,0.15)',

  cyan:   '#00D4FF',
  green:  '#00FF94',
  orange: '#FF7043',
  red:    '#FF4444',
  yellow: '#FFD700',

  textPrimary:   '#F0F0FF',
  textSecondary: '#8888AA',
  textMuted:     '#444460',

  codeBg: '#0D0D16',
};

export const FILE_ICONS = {
  dir: '📁',
  txt: '📄', md: '📝', log: '📋',
  js: '📜', jsx: '📜', ts: '📜', tsx: '📜',
  py: '🐍', rb: '💎', go: '🔵', rs: '🦀',
  json: '🗂️', xml: '🗂️', yaml: '🗂️', yml: '🗂️',
  html: '🌐', css: '🎨', scss: '🎨',
  png: '🖼️', jpg: '🖼️', jpeg: '🖼️', gif: '🖼️', svg: '🖼️', webp: '🖼️',
  mp3: '🎵', wav: '🎵', flac: '🎵',
  mp4: '🎬', mov: '🎬', avi: '🎬',
  pdf: '📕', doc: '📘', docx: '📘', xls: '📗', xlsx: '📗', ppt: '📙',
  zip: '📦', tar: '📦', gz: '📦', rar: '📦',
  sh: '⚙️', bat: '⚙️', env: '🔐', gitignore: '🚫',
};

export const FILE_TYPE_NAMES = {
  txt: 'Текстовий файл',
  md: 'Markdown документ',
  js: 'JavaScript файл',
  jsx: 'React JSX файл',
  ts: 'TypeScript файл',
  tsx: 'React TSX файл',
  json: 'JSON файл',
  html: 'HTML документ',
  css: 'CSS стилі',
  scss: 'SCSS стилі',
  py: 'Python скрипт',
  png: 'PNG зображення',
  jpg: 'JPEG зображення',
  jpeg: 'JPEG зображення',
  gif: 'GIF анімація',
  svg: 'SVG векторне зображення',
  mp3: 'MP3 аудіофайл',
  mp4: 'MP4 відеофайл',
  pdf: 'PDF документ',
  zip: 'ZIP архів',
  tar: 'TAR архів',
  gz: 'GZIP архів',
  sh: 'Shell скрипт',
  log: 'Файл журналу',
};

export const getExt = (name) => {
  const parts = name.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

export const getFileIcon = (name, isDir) => {
  if (isDir) return FILE_ICONS.dir;
  const ext = getExt(name);
  return FILE_ICONS[ext] || '📄';
};

export const getFileTypeName = (name, isDir) => {
  if (isDir) return 'Директорія';
  const ext = getExt(name);
  return FILE_TYPE_NAMES[ext] || (ext ? `Файл .${ext}` : 'Файл без розширення');
};

export const isTextFile = (name) => {
  const textExts = ['txt','md','log','js','jsx','ts','tsx','json','html','css','scss',
    'py','rb','go','rs','sh','bat','yaml','yml','xml','env','gitignore','csv','sql'];
  return textExts.includes(getExt(name));
};

export const formatSize = (bytes) => {
  if (bytes === undefined || bytes === null) return '—';
  if (bytes === 0) return '0 B';
  if (bytes < 1024)           return `${bytes} B`;
  if (bytes < 1024 ** 2)     return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3)     return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(3)} GB`;
};

export const formatDate = (timestamp) => {
  if (!timestamp) return '—';
  return new Date(timestamp * 1000).toLocaleString('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};
