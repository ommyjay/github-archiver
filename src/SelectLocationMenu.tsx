import React from "react";
import { Button, SelectMenu } from "evergreen-ui";

interface ISelectLocationMenuProps {
   repositoryLocations: string[];
   selectedItems: (string | number)[];
   setSelectedItems: React.Dispatch<React.SetStateAction<(string | number)[]>>
}

export function SelectLocationMenu({ repositoryLocations, selectedItems, setSelectedItems }: ISelectLocationMenuProps) {
   const [options] = React.useState(
      repositoryLocations.map(
         (label: string) => ({
            label,
            value: label,
         })
      )
   );
   const [selectedItemMessage, setSelectedItemMessage] = React.useState<
      string | null
   >(null);
   console.log('selectedItems :>> ', selectedItems);
   console.log('selectedItemMessage :>> ', selectedItemMessage);
   return (
      <SelectMenu
         width={240}
         isMultiSelect
         title="Select multiple location"
         options={options}
         selected={selectedItems as any}
         onSelect={(item) => {
            const selected = [...selectedItems, item.value];
            const currentSelected = selected;
            const selectedItemsLength = currentSelected.length;
            let selectedNames = "";
            if (selectedItemsLength === 0) {
               selectedNames = "";
            } else if (selectedItemsLength === 1) {
               selectedNames = currentSelected.toString();
            } else if (selectedItemsLength > 1) {
               const formatedSelection = currentSelected.reduce((previousValue, currentValue, currentIndex) => {
                  return previousValue + (currentIndex === currentSelected.length - 1 ? ' and ' : ', ') + currentValue;
               });
               selectedNames = `${formatedSelection}`;
            }
            setSelectedItems(currentSelected);
            setSelectedItemMessage(selectedNames);
         }}
         onDeselect={(item) => {
            const deselectedItemIndex = selectedItems.indexOf(item.value);
            const currentSelected = selectedItems.filter(
               (_item, i) => i !== deselectedItemIndex
            );
            const selectedItemsLength = currentSelected.length;
            let selectedNames = "";
            if (selectedItemsLength === 0) {
               selectedNames = "";
            } else if (selectedItemsLength === 1) {
               selectedNames = currentSelected.toString();
            } else if (selectedItemsLength > 1) {
               const formatedSelection = currentSelected.reduce((previousValue, currentValue, currentIndex) => {
                  return previousValue + (currentIndex === currentSelected.length - 1 ? ' and ' : ', ') + currentValue;
               });
               selectedNames = `${formatedSelection}`;
            }

            setSelectedItems(currentSelected);
            setSelectedItemMessage(selectedNames);
         }}
      >
         <Button width={"100%"} overflowX="auto" textTransform="capitalize">
            {selectedItemMessage || "Select Location"}
         </Button>
      </SelectMenu>
   );
}
