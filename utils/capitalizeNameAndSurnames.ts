export const capitalizeNameAndSurnames = (fullName: string): string => {
    const capitalizeWord = (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  
    const namesAndSurnames = fullName.split(" ");
    const capitalizedNamesAndSurnames = namesAndSurnames.map(capitalizeWord);
  
    return capitalizedNamesAndSurnames.join(" ");
  };
  