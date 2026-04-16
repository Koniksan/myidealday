import { Body1Strong, Button, Caption1, Field, Input, Link, mergeClasses, Text } from "@fluentui/react-components";
import { EyeOffRegular, EyeRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignUpPageStyles } from "./signup-page-styles";
import { PageLayout } from "../../components";
import { useAuth } from "../../infrastructure/context/auth-context";

const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
    return null;
};

const validatePassword = (value: string) => {
    if (!value) return "Password is required.";
    if (value.length < 6) return "Password must be at least 6 characters.";
    return null;
};

const validateConfirmPassword = (password: string, confirm: string) => {
    if (!confirm) return "Please confirm your password.";
    if (confirm !== password) return "Passwords do not match.";
    return null;
};

export const SignUpPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmError, setConfirmError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const styles = useSignUpPageStyles();
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const eErr = validateEmail(email);
        const pErr = validatePassword(password);
        const cErr = validateConfirmPassword(password, confirmPassword);
        setEmailError(eErr);
        setPasswordError(pErr);
        setConfirmError(cErr);
        if (eErr || pErr || cErr) return;

        const error = await signUp(email, password);
        if (error) {
            setSubmitError(error);
        } else {
            setSuccess(true);
        }
    };

    if (success) {
        return (
            <PageLayout centered>
                <div className={styles.card}>
                    <Body1Strong className={styles.subtitle}>Check your email</Body1Strong>
                    <Text>We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</Text>
                    <Text className={styles.login}>
                        {"Already confirmed? "}
                        <Link onClick={() => navigate("/")}>Log in</Link>
                    </Text>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout centered>
            <Body1Strong className={styles.subtitle}>Create your account</Body1Strong>

            <div className={styles.card}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <Field
                        validationState={emailError ? "error" : "none"}
                        validationMessage={emailError}
                    >
                        <Input
                            className={styles.input}
                            id="signup-email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setSubmitError(null);
                                if (emailError) setEmailError(validateEmail(e.target.value));
                            }}
                        />
                    </Field>

                    <Field
                        validationState={passwordError ? "error" : "none"}
                        validationMessage={passwordError}
                    >
                        <Input
                            className={mergeClasses(styles.input, styles.passwordInput)}
                            id="signup-password"
                            name="password"
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Create a password"
                            aria-label="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setSubmitError(null);
                                if (passwordError) setPasswordError(validatePassword(e.target.value));
                            }}
                            contentAfter={
                                <Button
                                    appearance="subtle"
                                    size="small"
                                    type="button"
                                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                                    onClick={() => setPasswordVisible(v => !v)}
                                    icon={passwordVisible ? <EyeOffRegular /> : <EyeRegular />}
                                />
                            }
                        />
                    </Field>

                    <Field
                        validationState={confirmError ? "error" : "none"}
                        validationMessage={confirmError}
                    >
                        <Input
                            className={mergeClasses(styles.input, styles.passwordInput)}
                            id="signup-confirm-password"
                            name="confirmPassword"
                            type={confirmVisible ? "text" : "password"}
                            placeholder="Confirm your password"
                            aria-label="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setSubmitError(null);
                                if (confirmError) setConfirmError(validateConfirmPassword(password, e.target.value));
                            }}
                            contentAfter={
                                <Button
                                    appearance="subtle"
                                    size="small"
                                    type="button"
                                    aria-label={confirmVisible ? "Hide password" : "Show password"}
                                    onClick={() => setConfirmVisible(v => !v)}
                                    icon={confirmVisible ? <EyeOffRegular /> : <EyeRegular />}
                                />
                            }
                        />
                    </Field>

                    {submitError && (
                        <Caption1 className={styles.submitError}>{submitError}</Caption1>
                    )}

                    <Button className={styles.submitButton} appearance="primary" type="submit">
                        Sign up
                    </Button>
                </form>

                <Text className={styles.login}>
                    {"Already have an account? "}
                    <Link onClick={() => navigate("/")}>Log in</Link>
                </Text>
            </div>
        </PageLayout>
    );
};
