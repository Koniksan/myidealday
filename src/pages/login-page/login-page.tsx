import { Button, Field, Input, Link, Subtitle1, Text } from "@fluentui/react-components";
import { EyeOffRegular, EyeRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { useLoginPageStyles } from "./login-page-styles";

export const LoginPage: React.FC = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const styles = useLoginPageStyles();

    return (
        <div className={styles.page}>
            <Subtitle1 as="h1" className={styles.title}> My Ideal Day</Subtitle1>
            <Text className={styles.subtitle}>Focus. Build. Repeat.</Text>

            <div className={styles.card}>
                <form className={styles.form} onSubmit={(e) => { e.preventDefault(); }}>
                    <Field>
                        <Input
                            className={styles.input}
                            id="login-identifier"
                            name="identifier"
                            placeholder="Enter your email or username"
                        />
                    </Field>

                    <Field>
                        <Input
                            className={styles.input}
                            id="login-password"
                            name="password"
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Enter your password"
                            aria-label="Password"
                            contentAfter={
                                <Button
                                    appearance="subtle"
                                    size="small"
                                    type="button"
                                    className={styles.passwordToggleButton}
                                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                                    onClick={() => setPasswordVisible(prevVal => !prevVal)}
                                    icon={passwordVisible ? <EyeOffRegular /> : <EyeRegular />}
                                    title={passwordVisible ? "Hide password" : "Show password"}
                                />
                            }
                        />
                    </Field>
                    <Button className={styles.loginButton} appearance="primary">
                        Login
                    </Button>
                </form>

                <Link href="#" className={styles.forgot} onClick={(e) => e.preventDefault()}>
                    Forgot password?
                </Link>
            </div>
        </div>
    );
};