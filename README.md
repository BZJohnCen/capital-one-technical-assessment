# capital-one-technical-assessment
Bai Zhuang Cen

# Assumptions:
Here are a list of assumptions I've deemed important to note.
- All lines of code within a block comment are considered as comment lines, open and close comment blocks included (`/*`, `*/`)
- Empty lines within the file are considered lines of code
- To-do comments will be presented in the file as follow the `TODO:`
- In python, `'''` will be counted as a String only
- Files that are to be checked can be in the current directory or in a separate directory
- For languages that do not support block comments (i.e python), consecutive single comments line by line will be considered 
block comments

# Things to note:
You may notice the `python-example.py` test file is outside the `tests` directory. This is intentional to showcase and test 
invoking the program without specifying a directory in the path.

I have written this assessment in Node.js even though a better fittng language would be something more low-level (i.e Java).
Ideally with a node-based solution, publishing this project/tool as a package/module onto npm as opposed to an application would allow for quick and easy use and access for the integration team.

The `loc-checker.js` file holds the main implementation of the lines of code/comment checker. The `syntax-checker.js` file acts a config file to correctly check the syntax of the file being checked.


# To test the Lines of Code Checker:
There are scripts that can be run to test the program:

`npm run testCheckerWithoutDir`
  - This will mimic a call to the L.O.C Checker without specifying a directory as an argument. The following script will test
  a python file.

`npm run testCheckerWithDir`
  - This will mimic a call to the L.O.C Checker with a directory specified as an argument. The following script will test
  a javascript/typescript file.

`npm run testCheckerWithDirJava`
  - This will mimic a call to the L.O.C Checker with a directory specified as an argument. The following script will test
  a java file.

`npm run testAllExampleFiles`
  - This will test and output results for the three exisitng example files.
