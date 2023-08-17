# School Crossing Guards

This a story map on school crossing guards in upper Manhattan, that combines crash data. This will hopefully show that there are significant need to fill vacant posts.

Building using React + Tailwindcss + MapboxGL + [React Scrollama](https://github.com/jsonkao/react-scrollama)

## Todos 
- Reduce the size of .js build by loading data from csvs/parquets instead of json imports. Current the size of the build is **50MB**
- Remove PII data files and any git history of them. `git rm --cached *.csv && git rm --cached *.json && && git rm --cached *.geojson` 
- Create a better narrative with pictures and other research
- Improvements to styling of the crash points (zoom based sizing?)
- Pending data for the rest of Manhattan
