const checkPageLoadTime = (performance, maxTime) => {
    performance.measure("pageLoad", "start-loading", "end-loading");
    const measure = performance.getEntriesByName("pageLoad")[0];
    const duration = measure.duration;
    assert.isAtMost(duration, maxTime);
}

export default checkPageLoadTime 
