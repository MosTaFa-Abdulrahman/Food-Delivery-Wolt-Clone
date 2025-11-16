import * as S from "./login.styles";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  AlertCircle,
  Store,
} from "lucide-react";

// Hook-Form && Zod
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validation/auth/login.validation";

// Context
import { AuthContext } from "../../context/AuthContext";
import { makeRequest } from "../../requestMethod";
import toast from "react-hot-toast";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setServerError("");

      // Call login API
      const response = await makeRequest.post("/auth/login", data);

      if (response.data) {
        const { token, user } = response.data;

        // Use context login with token
        await login(token);

        // Show success message
        toast.success(`Welcome back, ${user.username}!`);

        // Navigate to dashboard
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error || "Login failed. Please try again.";
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <S.Container>
      <S.LoginBox>
        <S.Header>
          <S.Logo>
            <Store size={40} />
          </S.Logo>
          <S.Title>Welcome Back</S.Title>
          <S.Subtitle>Login to access your dashboard</S.Subtitle>
        </S.Header>

        <S.Form onSubmit={handleSubmit(onSubmit)}>
          {/* Server Error Message */}
          {serverError && (
            <S.ServerError>
              <AlertCircle size={18} />
              {serverError}
            </S.ServerError>
          )}

          {/* Email Field */}
          <S.FormGroup>
            <S.Label>Email Address</S.Label>
            <S.InputWrapper>
              <S.InputIcon>
                <Mail size={20} />
              </S.InputIcon>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <S.Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    $hasError={!!errors.email}
                    autoComplete="email"
                  />
                )}
              />
            </S.InputWrapper>
            {errors.email && (
              <S.ErrorText>
                <AlertCircle size={14} />
                {errors.email.message}
              </S.ErrorText>
            )}
          </S.FormGroup>

          {/* Password Field */}
          <S.FormGroup>
            <S.Label>Password</S.Label>
            <S.InputWrapper>
              <S.InputIcon>
                <Lock size={20} />
              </S.InputIcon>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <S.PasswordInput
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    $hasError={!!errors.password}
                    autoComplete="current-password"
                  />
                )}
              />
              <S.PasswordToggle
                type="button"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </S.PasswordToggle>
            </S.InputWrapper>
            {errors.password && (
              <S.ErrorText>
                <AlertCircle size={14} />
                {errors.password.message}
              </S.ErrorText>
            )}
          </S.FormGroup>

          {/* Submit Button */}
          <S.SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Login
              </>
            )}
          </S.SubmitButton>
        </S.Form>
      </S.LoginBox>
    </S.Container>
  );
}

export default Login;
