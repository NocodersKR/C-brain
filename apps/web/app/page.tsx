import { Button } from "@repo/ui/button";
import { Header } from "../components/Header";
import {
  SavedArrowCurveLeftDownIcon,
  SavedArrowCurveLeftRightIcon,
  SavedArrowCurveLeftUpIcon,
  SavedArrowDownLeftIcon,
  SavedArrowCurveUpLeftIcon,
  SavedArrowCurveRightUpIcon,
  SavedArrowDownSquareContainedIcon,
  SavedArrowLeftSquareContainedIcon,
  SavedArrowRightSquareContainedIcon,
  SavedArrowUpSquareContainedIcon,
} from "../components/icons";
import styles from "./page.module.css";

const arrowIcons = [
  SavedArrowCurveLeftDownIcon,
  SavedArrowCurveLeftRightIcon,
  SavedArrowCurveLeftUpIcon,
  SavedArrowDownLeftIcon,
  SavedArrowCurveUpLeftIcon,
  SavedArrowCurveRightUpIcon,
  SavedArrowLeftSquareContainedIcon,
  SavedArrowRightSquareContainedIcon,
  SavedArrowUpSquareContainedIcon,
  SavedArrowDownSquareContainedIcon,
];

function ButtonIcon({ name }: { name: string }) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className={styles.buttonIcon}
      src={`/icons/button/${name}.svg`}
    />
  );
}

export default function Home() {
  return (
    <main className={styles.page}>
      <Header />
      <section className={styles.buttonSection}>
        <div className={styles.buttonGrid}>
          <Button
            leftIcon={<ButtonIcon name="arrow-left-solid" />}
            rightIcon={<ButtonIcon name="arrow-right-solid" />}
          >
            button
          </Button>
          <Button
            leftIcon={<ButtonIcon name="arrow-left-outline" />}
            rightIcon={<ButtonIcon name="arrow-right-outline" />}
            variant="outline"
          >
            button
          </Button>
          <Button
            disabled
            leftIcon={<ButtonIcon name="arrow-left-solid" />}
            rightIcon={<ButtonIcon name="arrow-right-solid" />}
          >
            button
          </Button>
          <Button
            disabled
            leftIcon={<ButtonIcon name="arrow-left-outline" />}
            rightIcon={<ButtonIcon name="arrow-right-outline" />}
            variant="outline"
          >
            button
          </Button>
          <Button rightIcon={<ButtonIcon name="arrow-right-solid" />}>button</Button>
          <Button leftIcon={<ButtonIcon name="arrow-left-outline" />} variant="outline">
            button
          </Button>
        </div>
      </section>
      <section className={styles.iconSection}>
        <ul className={styles.iconGrid}>
          {arrowIcons.map((Icon, index) => (
            <li className={styles.iconItem} key={index}>
              <Icon />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
