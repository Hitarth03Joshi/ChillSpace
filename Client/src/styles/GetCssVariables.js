import '../styles/variables.scss'

export const getCSSVariables = () => {
    const styles = getComputedStyle(document.documentElement);
    return {
      pinkred: styles.getPropertyValue("--pinkred").trim(),
      blue: styles.getPropertyValue("--blue").trim(),
      lightgrey: styles.getPropertyValue("--lightgrey").trim(),
      grey: styles.getPropertyValue("--grey").trim(),
      darkgrey: styles.getPropertyValue("--darkgrey").trim(),
    };
  };  