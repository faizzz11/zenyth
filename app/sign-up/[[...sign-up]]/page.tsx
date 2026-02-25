import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-2xl',
              formButtonPrimary: {
                backgroundColor: 'oklch(0.6 0.2 45)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'oklch(0.55 0.2 45)',
                },
                '&:focus': {
                  backgroundColor: 'oklch(0.55 0.2 45)',
                },
              },
              footerActionLink: {
                color: 'oklch(0.6 0.2 45)',
                '&:hover': {
                  color: 'oklch(0.55 0.2 45)',
                },
              },
            },
            variables: {
              colorPrimary: 'oklch(0.6 0.2 45)',
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}
