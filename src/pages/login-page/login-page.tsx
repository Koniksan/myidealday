import { Body1Strong, Button, Caption1, Field, Input, Link, mergeClasses, Spinner, Text, Subtitle1 } from "@fluentui/react-components";
import { EyeOffRegular, EyeRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginPageStyles } from "./login-page-styles";
import { PageLayout } from "../../components";
import { useAuth } from "../../infrastructure/context/auth-context";
import { useLocalization } from "../../infrastructure/context/locale-context";

export const LoginPage: React.FC = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [identifierError, setIdentifierError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const styles = useLoginPageStyles();
    const navigate = useNavigate();
    const { login } = useAuth();
    const rs = useLocalization();

    const validateIdentifier = (value: string) => {
        if (!value.trim()) return rs.EmailUsernameRequired;
        return null;
    };

    const validatePassword = (value: string) => {
        if (!value) return rs.PasswordRequired;
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const idErr = validateIdentifier(identifier);
        const pwErr = validatePassword(password);
        setIdentifierError(idErr);
        setPasswordError(pwErr);
        if (idErr || pwErr) return;

        setLoading(true);
        const error = await login(identifier, password);
        setLoading(false);
        if (error) {
            setLoginError(error);
        } else {
            navigate("/user");
        }
    };

    return (
        <PageLayout centered>
            <Body1Strong className={styles.subtitle}>{rs.FocusBuildRepeat}</Body1Strong>

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
                            placeholder={rs.EmailUsernamePlaceholder}
                            value={identifier}
                            onChange={(e) => {
                                setIdentifier(e.target.value);
                                setLoginError(null);
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
                            placeholder={rs.PasswordPlaceholder}
                            aria-label={rs.Password}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setLoginError(null);
                                if (passwordError) setPasswordError(validatePassword(e.target.value));
                            }}
                            contentAfter={
                                <Button
                                    appearance="subtle"
                                    size="small"
                                    type="button"
                                    aria-label={passwordVisible ? rs.HidePassword : rs.ShowPassword}
                                    onClick={() => setPasswordVisible(prevVal => !prevVal)}
                                    icon={passwordVisible ? <EyeOffRegular /> : <EyeRegular />}
                                    title={passwordVisible ? rs.HidePassword : rs.ShowPassword}
                                />
                            }
                        />
                    </Field>
                    {loginError && (
                        <Caption1 className={styles.loginError}>{loginError}</Caption1>
                    )}
                    <Button
                        className={styles.loginButton}
                        appearance="primary"
                        type="submit"
                        disabled={loading}
                        icon={loading ? <Spinner size="tiny" /> : undefined}
                    >
                        {rs.Login}
                    </Button>
                </form>

                <Link href="#" className={styles.forgot} onClick={(e) => e.preventDefault()}>
                    {rs.ForgotPassword}
                </Link>

                <Text className={styles.register}>
                    {rs.NoAccount}
                    <Link onClick={() => navigate("/signup")}>
                        {rs.SignUpLink}
                    </Link>
                </Text>
            </div>
        </PageLayout>
    );
};