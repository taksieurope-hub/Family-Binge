import pathlib, re

path = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\PricingSection.jsx')
c = path.read_text(encoding='utf-8')

# Replace everything between onApprove start and its closing }; 
new_func = '''  const onApprove = async (data, actions, plan) => {
    const res = await fetch('https://family-binge-backend.onrender.com/api/payment/capture-order/' + data.orderID, {
      method: 'POST'
    });
    if (res.ok) {
      const user = auth.currentUser;
      if (user) {
        await fetch('https://family-binge-backend.onrender.com/api/payment/activate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.uid, plan: plan.id, order_id: data.orderID })
        });
      }
      alert('Payment successful! Plan: ' + plan.name);
      window.location.href = '/app';
    }
  };'''

# Use regex to replace the onApprove function
c2 = re.sub(r'const onApprove = async[\s\S]*?^\  \};', new_func, c, flags=re.MULTILINE)

if c2 != c:
    path.write_text(c2, encoding='utf-8')
    print('Done!')
else:
    print('Regex did not match - writing new_func manually')
    # Find the line and replace from there
    lines = c.split('\n')
    start = None
    end = None
    depth = 0
    for i, line in enumerate(lines):
        if 'const onApprove = async' in line:
            start = i
            depth = 0
        if start is not None:
            depth += line.count('{') - line.count('}')
            if depth == 0 and i > start:
                end = i
                break
    if start and end:
        lines[start:end+1] = new_func.split('\n')
        path.write_text('\n'.join(lines), encoding='utf-8')
        print('Done via line replacement!')
    else:
        print('FAILED - could not find onApprove')
