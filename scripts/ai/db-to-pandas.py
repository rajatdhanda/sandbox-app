# Future AI pipeline for pulling Supabase data and analyzing using Pandas

import pandas as pd
from supabase import create_client, Client

url = "https://your-project.supabase.co"
key = "your-anon-or-service-key"
supabase: Client = create_client(url, key)

response = supabase.table("users").select("*").execute()
data = response.data

df = pd.DataFrame(data)
print(df.head())
