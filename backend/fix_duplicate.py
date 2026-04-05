import re

path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx'
c = open(path, 'r', encoding='utf-8').read()

# Remove duplicate selectChannel - keep only one
# Find all occurrences
occurrences = [m.start() for m in re.finditer(r'const selectChannel', c)]
print(f"Found {len(occurrences)} occurrences of selectChannel")

if len(occurrences) > 1:
    # Remove the first occurrence and everything between it and the second one
    first = occurrences[0]
    second = occurrences[1]
    c = c[:first] + c[second:]
    open(path, 'w', encoding='utf-8').write(c)
    print("Fixed - removed duplicate")
else:
    print("Only one occurrence found, no fix needed")
