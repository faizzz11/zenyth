'use client';

interface CustomTopicInputProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

function sanitizeInput(input: string): string {
  // Remove script tags, SQL injection patterns, and other malicious content
  let sanitized = input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/\$\{/g, '')
    .replace(/\{\{/g, '')
    .replace(/DROP\s+TABLE/gi, '')
    .replace(/DELETE\s+FROM/gi, '')
    .replace(/INSERT\s+INTO/gi, '')
    .replace(/UPDATE\s+SET/gi, '');
  
  return sanitized;
}

export default function CustomTopicInput({ value, onChange, error }: CustomTopicInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value);
    onChange(sanitized);
  };

  const charCount = value.length;
  const isValid = charCount >= 3 && charCount <= 200;
  const showError = error || (charCount > 0 && !isValid);

  return (
    <div className="w-full flex flex-col gap-2">
      <label 
        htmlFor="custom-topic-input"
        className="text-[#37322F] text-sm font-medium leading-5 font-sans"
      >
        Your Topic
      </label>
      <div className="relative">
        <input
          id="custom-topic-input"
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Enter your meme topic..."
          maxLength={200}
          className={`w-full px-4 py-3 rounded-lg border bg-white text-[#37322F] text-sm font-normal font-sans placeholder:text-[#605A57] focus:outline-none focus:ring-2 focus:ring-[rgba(55,50,47,0.12)] transition-all ${
            showError
              ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
              : 'border-[rgba(55,50,47,0.12)] focus:border-[#37322F]'
          }`}
          aria-label="Custom topic input"
          aria-invalid={!!showError}
          aria-describedby={showError ? 'topic-error' : 'topic-hint'}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#605A57] text-xs font-normal font-sans">
          {charCount}/200
        </div>
      </div>
      
      {showError ? (
        <div id="topic-error" className="text-red-600 text-xs font-normal font-sans">
          {error || (charCount < 3 ? 'Topic must be at least 3 characters' : 'Topic must be no more than 200 characters')}
        </div>
      ) : (
        <div id="topic-hint" className="text-[#605A57] text-xs font-normal font-sans">
          Enter a topic between 3 and 200 characters
        </div>
      )}
    </div>
  );
}
