import { Button, Menu, MenuItemRadio, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import React from "react";
import { useLocale, useLocalization } from "../../../infrastructure/context/locale-context";
import { Locale } from "../../../infrastructure/context/translations";
import { FlagRU, FLAGS, FlagUS } from "./language-switcher-icon-list";
import { useStyles } from "./language-switcher-styles";


export const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale } = useLocale();
    const rs = useLocalization();
    const styles = useStyles();
    const CurrentFlag = FLAGS[locale];

    return (
        <Menu
            checkedValues={{ locale: [locale] }}
            onCheckedValueChange={(_, { checkedItems }) => setLocale(checkedItems[0] as Locale)}
        >
            <MenuTrigger disableButtonEnhancement>
                <Button className={styles.triggerButton} appearance="subtle">
                    <span className={styles.option}>
                        <CurrentFlag />
                        {locale === "en" ? rs.LocaleEN : rs.LocaleRU}
                    </span>
                </Button>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItemRadio name="locale" value="en">
                        <span className={styles.option}><FlagUS />{rs.English}</span>
                    </MenuItemRadio>
                    <MenuItemRadio name="locale" value="ru">
                        <span className={styles.option}><FlagRU />{rs.Russian}</span>
                    </MenuItemRadio>
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
