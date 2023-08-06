import { useQuery } from "@apollo/client";
import { GET_ROOM_TYPES } from "../queries/query";


export default function Home() {
    const { loading, error, data } = useQuery(GET_ROOM_TYPES);

    if (loading) return <div>loading...</div>
    if (error) return <div>{error.message}</div>


    return (
        <>
            <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. At corporis quisquam, sed nihil earum perspiciatis est animi consectetur veniam odio similique, doloremque maiores ratione sunt fuga labore quibusdam ad ex, inventore error iusto illo officiis iste officia! Eius molestiae voluptate quisquam? Cupiditate, ducimus quibusdam? Temporibus minus consectetur quos maxime, modi voluptatum atque, laudantium officiis accusamus esse magni. Officia ipsam nisi necessitatibus labore unde, atque dolorum laudantium, eum beatae dolorem delectus laboriosam iusto deserunt perferendis quasi assumenda reprehenderit ratione distinctio repudiandae, et molestias nemo nesciunt nulla. Officia natus ad nobis placeat minus perferendis, debitis recusandae, rem modi fugit laudantium cum accusamus!
            </div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
    )
}
