const useCSVDownload = () => {
    const download = (name, data) => {
        let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
        hiddenElement.target = '_blank';
        hiddenElement.download = name;
        hiddenElement.click();
    }
    
    return {
        download
    }
}

export default useCSVDownload;