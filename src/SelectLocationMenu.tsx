import React from "react";
import { Button, SelectMenu } from "evergreen-ui";

interface ISelectLocationMenuProps {
   repositoryLocations: string[];
}

export function SelectLocationMenu({ repositoryLocations }: ISelectLocationMenuProps) {

   const [options] = React.useState(
      repositoryLocations.map(
         (label: string) => ({
            label,
            value: label,
         })
      )
   );
   const [selectedItemsState, setSelectedItems] = React.useState<
      (string | number)[]
   >([]);
   const [selectedItemNamesState, setSelectedItemNames] = React.useState<
      string | null
   >(null);
   console.log('selectedItemsState :>> ', selectedItemsState);
   console.log('selectedItemNamesState :>> ', selectedItemNamesState);
   return (
      <SelectMenu
         width={240}
         isMultiSelect
         title="Select multiple location"
         options={options}
         selected={selectedItemsState as any}
         onSelect={(item) => {
            const selected = [...selectedItemsState, item.value];
            const selectedItems = selected;
            const selectedItemsLength = selectedItems.length;
            let selectedNames = "";
            if (selectedItemsLength === 0) {
               selectedNames = "";
            } else if (selectedItemsLength === 1) {
               selectedNames = selectedItems.toString();
            } else if (selectedItemsLength > 1) {
               const formatedSelection = selectedItems.reduce((previousValue, currentValue, currentIndex) => {
                  return previousValue + (currentIndex === selectedItems.length - 1 ? ' & ' : ', ') + currentValue;
               });
               selectedNames = formatedSelection + " Selected";
            }
            setSelectedItems(selectedItems);
            setSelectedItemNames(selectedNames);
         }}
         onDeselect={(item) => {
            const deselectedItemIndex = selectedItemsState.indexOf(item.value);
            const selectedItems = selectedItemsState.filter(
               (_item, i) => i !== deselectedItemIndex
            );
            const selectedItemsLength = selectedItems.length;
            let selectedNames = "";
            if (selectedItemsLength === 0) {
               selectedNames = "";
            } else if (selectedItemsLength === 1) {
               selectedNames = selectedItems.toString();
            } else if (selectedItemsLength > 1) {
               const formatedSelection = selectedItems.reduce((previousValue, currentValue, currentIndex) => {
                  return previousValue + (currentIndex === selectedItems.length - 1 ? ' and ' : ', ') + currentValue;
               });
               selectedNames = formatedSelection + " Selected";
            }

            setSelectedItems(selectedItems);
            setSelectedItemNames(selectedNames);
         }}
      >
         <Button width={"100%"} overflowX="auto">
            {selectedItemNamesState || "Select location..."}
         </Button>
      </SelectMenu>
   );
}
