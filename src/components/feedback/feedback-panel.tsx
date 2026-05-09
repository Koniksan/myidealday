import {
    Button,
    DrawerBody, DrawerHeader, DrawerHeaderTitle,
    OverlayDrawer,
    Spinner,
    Text,
    Textarea,
} from "@fluentui/react-components";
import { AddRegular, ArrowLeftRegular, ChatRegular, DismissRegular } from "@fluentui/react-icons";
import React from "react";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { useNotificationBadge } from "../../infrastructure/context/notification-badge-context";
import { FeedbackItem } from "./feedback-item";
import { useFeedbackPanelStyles } from "./feedback-panel-styles";
import { useFeedbackPanel } from "./use-feedback-panel";

interface FeedbackPanelProps {
    open: boolean;
    onClose: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ open, onClose }) => {
    const styles = useFeedbackPanelStyles();
    const rs = useLocalization();
    const { getUnreadIds, markSeen } = useNotificationBadge();
    const unreadIds = getUnreadIds("feedback");

    const {
        feedbacks,
        loading,
        composing,
        setComposing,
        draft,
        setDraft,
        sending,
        handleDelete,
        handleSubmit,
        handleClose,
    } = useFeedbackPanel(open, onClose);

    return (
        <>
            <OverlayDrawer position="end" open={open} onOpenChange={(_, { open: isOpen }) => !isOpen && handleClose()}>
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={<Button appearance="subtle" icon={<DismissRegular />} onClick={handleClose} />}
                    >
                        {rs.MyFeedbacks}
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody className={styles.body}>
                    <Button appearance="primary" icon={<AddRegular />} onClick={() => setComposing(true)}>
                        {rs.NewFeedback}
                    </Button>

                    {loading ? (
                        <div className={styles.center}><Spinner size="medium" /></div>
                    ) : feedbacks.length === 0 ? (
                        <div className={styles.emptyState}>
                            <ChatRegular fontSize={32} />
                            <Text>{rs.NoFeedbackYet}</Text>
                        </div>
                    ) : (
                        <div className={styles.list}>
                            {feedbacks.map(f => (
                                <FeedbackItem
                                    key={f.id}
                                    feedback={f}
                                    onDelete={handleDelete}
                                    isUnread={unreadIds.has(f.id)}
                                    onSeen={() => markSeen("feedback", f.id)}
                                />
                            ))}
                        </div>
                    )}
                </DrawerBody>
            </OverlayDrawer>

            <OverlayDrawer position="end" open={composing} onOpenChange={(_, { open: isOpen }) => !isOpen && setComposing(false)}>
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={<Button appearance="subtle" icon={<DismissRegular />} onClick={() => setComposing(false)} />}
                    >
                        <Button appearance="subtle" icon={<ArrowLeftRegular />} onClick={() => setComposing(false)} />
                        {rs.NewFeedback}
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody className={styles.composeBody}>
                    <Textarea
                        className={styles.textarea}
                        placeholder={rs.FeedbackPlaceholder}
                        value={draft}
                        onChange={(_, d) => setDraft(d.value)}
                        resize="vertical"
                    />
                    <Button
                        appearance="primary"
                        disabled={!draft.trim() || sending}
                        icon={sending ? <Spinner size="tiny" /> : undefined}
                        onClick={handleSubmit}
                    >
                        {rs.Send}
                    </Button>
                </DrawerBody>
            </OverlayDrawer>
        </>
    );
};
