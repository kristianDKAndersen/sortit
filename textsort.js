const textSort = () => {

    document.addEventListener('DOMContentLoaded', (event) => {
       
        
        const txtsearch = document.querySelector("#txtsearch");
       
        txtsearch.addEventListener('keyup', (event) => {
            search(event);
        });

        txtsearch.addEventListener('blur', (event) => {
            search(event);
        });

        const search = (event) => {
            
      
            const listsItems = document.querySelectorAll(".sortable-list > li[data-item]")
            const search = event.target.value.toLowerCase();
            
            listsItems.forEach((item) => {

                const text = item.getAttribute("data-item").toLowerCase();
              const isMatch = text.includes(search);

                if(isMatch) {
                let parent = item.parentNode;
                let childNode = parent.firstChild;

                parent.insertBefore(item, childNode);
                }
                
            });
        }
        
    });

}
export {textSort}