import { Body1Strong, Button, Field, Input, Link, mergeClasses, Subtitle1, Tooltip } from "@fluentui/react-components";
import { EyeOffRegular, EyeRegular, WeatherMoonRegular, WeatherSunnyRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { useLoginPageStyles } from "./login-page-styles";
import { PageLayout } from "../../components";
import { useTheme } from "../../context/theme-context";

const validateIdentifier = (value: string) => {
    if (!value.trim()) return "Email or username is required.";
    return null;
};

const validatePassword = (value: string) => {
    if (!value) return "Password is required.";
    if (value.length < 6) return "Password must be at least 6 characters.";
    return null;
};

export const LoginPage: React.FC = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [identifierError, setIdentifierError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const styles = useLoginPageStyles();
    const { isDark, toggleTheme } = useTheme();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const idErr = validateIdentifier(identifier);
        const pwErr = validatePassword(password);
        setIdentifierError(idErr);
        setPasswordError(pwErr);
        if (!idErr && !pwErr) {
            // proceed with login
        }
    };

    return (
        <PageLayout>
            <Tooltip content={isDark ? "Switch to light mode" : "Switch to dark mode"} relationship="label">
                <Button
                    className={styles.themeToggle}
                    appearance="subtle"
                    icon={isDark ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
                    onClick={toggleTheme}
                />
            </Tooltip>
            <Subtitle1 as="h1" className={styles.title}> My ideal day</Subtitle1>
            <Body1Strong className={styles.subtitle}>Focus. Build. Repeat.</Body1Strong>

            <div className={styles.card}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <Field
                        validationState={identifierError ? "error" : "none"}
                        validationMessage={identifierError}
                    >
                        <Input
                            className={styles.input}
                            id="login-identifier"
                            name="identifier"
                            placeholder="Enter your email or username"
                            value={identifier}
                            onChange={(e) => {
                                setIdentifier(e.target.value);
                                if (identifierError) setIdentifierError(validateIdentifier(e.target.value));
                            }}
                        />
                    </Field>

                    <Field
                        validationState={passwordError ? "error" : "none"}
                        validationMessage={passwordError}
                    >
                        <Input
                            className={mergeClasses(styles.input, styles.passwordInput)}
                            id="login-password"
                            name="password"
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Enter your password"
                            aria-label="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (passwordError) setPasswordError(validatePassword(e.target.value));
                            }}
                            contentAfter={
                                <Button
                                    appearance="subtle"
                                    size="small"
                                    type="button"
                                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                                    onClick={() => setPasswordVisible(prevVal => !prevVal)}
                                    icon={passwordVisible ? <EyeOffRegular /> : <EyeRegular />}
                                    title={passwordVisible ? "Hide password" : "Show password"}
                                />
                            }
                        />
                    </Field>
                    <Button className={styles.loginButton} appearance="primary" type="submit">
                        Login
                    </Button>
                </form>

                <Link href="#" className={styles.forgot} onClick={(e) => e.preventDefault()}>
                    Forgot password?
                </Link>
            </div>
        </PageLayout>

    );
};