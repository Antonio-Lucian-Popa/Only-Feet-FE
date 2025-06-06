import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { register as registerUser } from '@/lib/services/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import { FootprintsIcon, Loader2 } from 'lucide-react';

const registerSchema = z.object({
  firstName: z.string().min(3, { message: 'First name must be at least 3 characters' }),
  lastName: z.string().min(3, { message: 'Last name must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
  role: z.enum(['CREATOR', 'USER']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'USER',
    },
  });

  const role = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await registerUser(data.firstName, data.lastName, data.email, data.password, data.role);
      navigate('/login');
      toast({
        title: 'Registration successful',
        description: `Welcome to OnlyFeet, ${response.firstName}!`,
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: 'There was an error creating your account. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-6 bg-card rounded-lg shadow-sm">
      <div className="space-y-2 text-center">
        <div className="flex justify-center">
          <FootprintsIcon className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-muted-foreground">Enter your details to get started</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstname">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="johndoe"
            autoComplete="firstName"
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstname">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="johndoe"
            autoComplete="lastName"
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>I want to join as a:</Label>
          <RadioGroup defaultValue="USER" className="flex space-x-4" {...register('role')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="USER" id="user" />
              <Label htmlFor="user" className="cursor-pointer">User</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="CREATOR" id="creator" />
              <Label htmlFor="creator" className="cursor-pointer">Creator</Label>
            </div>
          </RadioGroup>
        </div>

        {role === 'CREATOR' && (
          <div className="rounded-lg border p-3 bg-secondary/30">
            <p className="text-sm">
              <strong>Note:</strong> As a creator, you'll be able to set up your profile, upload content, and receive payments from subscribers.
            </p>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;