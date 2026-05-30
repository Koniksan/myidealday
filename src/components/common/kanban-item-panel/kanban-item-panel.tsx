import {
    Button,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerHeaderTitle,
    Label,
    OverlayDrawer,
    Text,
    Textarea,
    Tooltip,
    mergeClasses,
} from "@fluentui/react-components";
import { DismissRegular, Image24Regular } from "@fluentui/react-icons";
import React from "react";
import { FeedbackType } from "../../../infrastructure";
import { ImageUploadPreview, StatusBadge, TypeBadge } from "..";
import { useKanbanItemPanelStyles } from "./kanban-item-panel-styles";
import { KanbanItemPanelProps, useKanbanItemPanel } from "./use-kanban-item-panel";

const STATUSES = ["New", "In Progress", "Completed"] as const;
const TYPES = [FeedbackType.Unassign, FeedbackType.Feature, FeedbackType.Bug, FeedbackType.Performance];

export const KanbanItemPanel: React.FC<KanbanItemPanelProps> = (props) => {
    const styles = useKanbanItemPanelStyles();
    const {
        rs,
        fileInputRef,
        editStatus,
        editType,
        editAnswer,
        editMessage,
        imagePreview,
        imageOriginalSize,
        imageCompressedSize,
        saving,
        isOpen,
        titleText,
        setEditStatus,
        setEditType,
        setEditAnswer,
        setEditMessage,
        handleImageSelect,
        handleRemoveImage,
        handleSave,
    } = useKanbanItemPanel(props);

    const { mode, onClose } = props;

    const title = mode === 'Edit'
        ? (
            <div className={styles.panelHeaderTitle}>
                {props.feedback?.avatarUrl && (
                    <img src={props.feedback.avatarUrl} className={styles.panelHeaderAvatar} />
                )}
                {titleText}
            </div>
        )
        : titleText;

    return (
        <OverlayDrawer
            open={isOpen}
            size="medium"
            onOpenChange={(_, d) => !d.open && onClose()}
            position="end"
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={<Button appearance="subtle" icon={<DismissRegular />} onClick={onClose} />}
                >
                    {title}
                </DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody className={styles.feedbackPanelBody}>
                {mode === 'Edit' ? (
                    <>
                        <Text className={styles.feedbackDialogMessage}>{props.feedback?.message}</Text>
                        {props.feedback?.imageUrl && (
                            <img src={props.feedback.imageUrl} className={styles.feedbackImage} />
                        )}
                        <div className={styles.fieldSection}>
                            <Label className={styles.fieldLabel}>{rs.TypeLabel}</Label>
                            <div className={styles.radioGroup}>
                                {TYPES.map(x => (
                                    <div
                                        key={x}
                                        className={mergeClasses(styles.radioItem, editType === x && styles.radioItemSelected)}
                                        onClick={e => setEditType(x)}
                                    >
                                        {x === FeedbackType.Unassign
                                            ? <span className={styles.typeRadioNone}>—</span>
                                            : <TypeBadge type={x} />
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.fieldSection}>
                            <Label className={styles.fieldLabel}>{rs.StatusLabel}</Label>
                            <div className={styles.radioGroup}>
                                {STATUSES.map(x => (
                                    <div
                                        key={x}
                                        className={mergeClasses(styles.radioItem, editStatus === x && styles.radioItemSelected)}
                                        onClick={e => setEditStatus(x)}
                                    >
                                        <StatusBadge status={x} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.fieldSection}>
                            <Label className={styles.fieldLabel}>{rs.ReplyLabel}</Label>
                            <Textarea
                                className={styles.feedbackAnswer}
                                resize="vertical"
                                placeholder={rs.AdminReplyPlaceholder}
                                value={editAnswer}
                                onChange={(_, d) => setEditAnswer(d.value)}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.fieldSection}>
                            <Label className={styles.fieldLabel}>{rs.FeedbackPlaceholder}</Label>
                            <div className={styles.textareaWrapper}>
                                <Textarea
                                    className={styles.feedbackMessage}
                                    resize="vertical"
                                    placeholder={rs.FeedbackPlaceholder}
                                    value={editMessage}
                                    onChange={(_, d) => setEditMessage(d.value)}
                                />
                                <div className={styles.textareaToolbar}>
                                    <Tooltip content={rs.AttachImage} relationship="label">
                                        <Button
                                            appearance="subtle"
                                            size="small"
                                            icon={<Image24Regular />}
                                            onClick={e => fileInputRef.current?.click()}
                                            disabled={saving}
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        {imagePreview && (
                            <ImageUploadPreview
                                imagePreview={imagePreview}
                                imageOriginalSize={imageOriginalSize}
                                imageCompressedSize={imageCompressedSize}
                                onRemove={handleRemoveImage}
                            />
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleImageSelect(f); e.target.value = ""; }}
                        />
                        <div className={styles.fieldSection}>
                            <Label className={styles.fieldLabel}>{rs.TypeLabel}</Label>
                            <div className={styles.radioGroup}>
                                {TYPES.map(x => (
                                    <div
                                        key={x}
                                        className={mergeClasses(styles.radioItem, editType === x && styles.radioItemSelected)}
                                        onClick={e => setEditType(x)}
                                    >
                                        {x === FeedbackType.Unassign
                                            ? <span className={styles.typeRadioNone}>—</span>
                                            : <TypeBadge type={x} />
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.fieldSection}>
                            <Label className={styles.fieldLabel}>{rs.StatusLabel}</Label>
                            <div className={styles.radioGroup}>
                                {STATUSES.map(x => (
                                    <div
                                        key={x}
                                        className={mergeClasses(styles.radioItem, editStatus === x && styles.radioItemSelected)}
                                        onClick={e => setEditStatus(x)}
                                    >
                                        <StatusBadge status={x} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </DrawerBody>
            <DrawerFooter className={styles.drawerFooter}>
                <Button appearance="primary" disabled={saving} onClick={handleSave}>
                    {saving ? rs.Saving : rs.Save}
                </Button>
                <Button appearance="subtle" onClick={onClose}>{rs.Cancel}</Button>
            </DrawerFooter>
        </OverlayDrawer>
    );
};
