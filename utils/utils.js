import { useRef, useEffect } from "react";

export function getSectionListData(data) {

  const sectionMap = new Map();
  data.forEach(item=>{
    if(!sectionMap.has(item.category)) {
      sectionMap.set(item.category, []);
    }
    sectionMap.get(item.category).push({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
    });
  });
  const sectionListData = Array.from(sectionMap.entries()).map(([key, value])=>{return {'title':key, 'data':value};});
  return sectionListData;
}



export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
