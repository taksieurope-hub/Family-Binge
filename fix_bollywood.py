import pathlib, re

f = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ContentSection.jsx')
c = f.read_text(encoding='utf-8')

# Fix import
c = c.replace(
    "import { movieAPI, seriesAPI } from '../services/api';",
    "import { movieAPI, seriesAPI, bollywoodAPI } from '../services/api';"
)

# Replace ContentSection function up to end of useEffect
old = """const ContentSection = ({ type = 'movies', onSelectContent }) => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const Icon = type === 'movies' ? Film : Tv;
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const api = type === 'movies' ? movieAPI : seriesAPI;
        const [trendingRes, popularRes, topRatedRes] = await Promise.all([
          api.getTrending(1),
          api.getPopular(1),
          api.getTopRated(1),
        ]);
        setTrending(trendingRes.data.items || []);
        setPopular(popularRes.data.items || []);
        setTopRated(topRatedRes.data.items || []);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [type]);"""

new = """const ContentSection = ({ type = 'movies', onSelectContent }) => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [bollywood, setBollywood] = useState([]);
  const [hindiSeries, setHindiSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const Icon = type === 'movies' ? Film : Tv;
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const api = type === 'movies' ? movieAPI : seriesAPI;
        const [trendingRes, popularRes, topRatedRes] = await Promise.all([
          api.getTrending(1),
          api.getPopular(1),
          api.getTopRated(1),
        ]);
        setTrending(trendingRes.data.items || []);
        setPopular(popularRes.data.items || []);
        setTopRated(topRatedRes.data.items || []);
        if (type === 'movies') {
          const [bollywoodRes, hindiSeriesRes] = await Promise.all([
            bollywoodAPI.getTrending(1),
            bollywoodAPI.getHindiSeries(1),
          ]);
          setBollywood(bollywoodRes.data.items || []);
          setHindiSeries(hindiSeriesRes.data.items || []);
        }
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [type]);"""

if old in c:
    c = c.replace(old, new)
    f.write_text(c, encoding='utf-8')
    print('SUCCESS - replaced!')
else:
    print('NOT FOUND - no change made')
