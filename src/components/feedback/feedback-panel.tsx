import {
    Button,
    DrawerBody, DrawerHeader, DrawerHeaderTitle,
    OverlayDrawer,
    Spinner,
    Text,
} from "@fluentui/react-components";
import { AddRegular, ChatRegular, DismissRegular } from "@fluentui/react-icons";
import React from "react";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { useNotificationBadge } from "../../infrastructure/context/notification-badge-context";
import { FeedbackItem } from "./feedback-item";
import { useFeedbackPanelStyles } from "./feedback-panel-styles";
import { useFeedbackPanel } from "./use-feedback-panel";
import { AddFeedbackPanel } from "./add-feedback-panel";

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
        handleDelete,
        handleClose,
        prependFeedback,
    } = useFeedbackPanel(open, onClose);

    return (
        <>
            <OverlayDrawer size="medium" position="end" open={open} onOpenChange={(_, { open: isOpen }) => !isOpen && handleClose()}>
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={<Button appearance="subtle" icon={<DismissRegular />} onClick={handleClose} />}
                    >
                        {rs.MyFeedbacks}
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody className={styles.body}>
                    <Button appearance="primary" className={styles.addFeedbackButton} icon={<AddRegular />} onClick={() => setComposing(true)}>
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
            <AddFeedbackPanel open={composing} onClose={() => setComposing(false)} onSuccess={prependFeedback} />
        </>
    );
};
